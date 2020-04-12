import MongoClient from 'mongodb'


export async function connect() {
    try {

        const client = await MongoClient.connect('mongodb+srv://admin:Sevilla2020@cluster0-g1gir.mongodb.net/test?retryWrites=true&w=majority', {
            useUnifiedTopology: true
        })
        const db = client.db('coronavirus')
        /*
       const client = await MongoClient.connect('mongodb://localhost:27017', {
            useUnifiedTopology: true
            
        })        const db = client.db('coronavirus')
*/
        console.log('DB is connected')

        return db
    } catch (e) {
        console.log(e)
    }
}