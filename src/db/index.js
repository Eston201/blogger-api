import pg from 'pg'

const pool = new pg.Pool({
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'blogger',
    host: 'localhost',
    port: '5432'
});

// Used for SINGLE queries only!. No transactions
export const query = async (sql, params) => {
    const res = pool.query(sql, params);
    return res;
}

// Get a client for transactions.
export const getClient = async() => {
    const client = await pool.connect()

    // The below code just avoids client leaks taken from the pg docs 
    const query = client.query
    const release = client.release
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
    }, 5000)
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
    }
    client.release = () => {
        // clear our timeout
        clearTimeout(timeout)
        // set the methods back to their old un-monkey-patched version
        client.query = query
        client.release = release
        return release.apply(client)
    }
    return client;
}
