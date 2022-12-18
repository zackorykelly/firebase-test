import app from "./FirebaseConfig";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"

const firestore = getFirestore(app);

const createDocument = async (collectionName, document) => {
    try {
       const docRef = await addDoc(collection(firestore, collectionName), document)
       return docRef; 
    } catch (err) {
        alert(err.message);
    }
}

const readDocument = async ({collectionName, queries}) => {
    const collectionRef = collection(firestore, collectionName);
    const queryConstraints = []
    if (queries && queries.length > 0) {
        for (const query of queries) {
            queryConstraints.push(where(query.field, query.condition, query.value));;
        }
    }

    const orderByDirection = ''
    const orderByField = ''
    if (orderByField && orderByDirection) {
        queryConstraints.push(orderBy(orderByField, orderByDirection));;
    }

    const perPage = ''
    if (perPage) {
        queryConstraints.push(limit(perPage));;
    }

    const cursorId = ''
    if (cursorId) {
        const document = await readDocument(collection, cursorId)
        queryConstraints.push(startAfter(document));
    }

    try {
        console.log(collectionRef, queryConstraints)
        const docs = await getDocs(query(collectionRef, ...queryConstraints))
        console.log(docs)
        return docs
    } catch (err) {
        alert(err.message);
    }
}

const FirebaseFirestoreService = {
    createDocument,
    readDocument
}

export default FirebaseFirestoreService