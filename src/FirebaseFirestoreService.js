import app from "./FirebaseConfig";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, startAfter, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore"

const firestore = getFirestore(app);

const createDocument = async (collectionName, document) => {
    try {
       const docRef = await addDoc(collection(firestore, collectionName), document)
       return docRef; 
    } catch (err) {
        alert(err.message);
    }
}

const readDocuments = async ({collectionName, queries, orderByField, orderByDirection, perPage, cursorId}) => {
    const collectionRef = collection(firestore, collectionName);
    const queryConstraints = []
    if (queries && queries.length > 0) {
        for (const query of queries) {
            queryConstraints.push(where(query.field, query.condition, query.value));;
        }
    }

    if (orderByField && orderByDirection) {
        queryConstraints.push(orderBy(orderByField, orderByDirection));;
    }

    if (perPage) {
        queryConstraints.push(limit(perPage));;
    }

    if (cursorId) {
        const document = await readDocument(collectionName, cursorId)
        queryConstraints.push(startAfter(document));
    }

    try {
        console.log(collectionRef, queryConstraints)
        const docs = await getDocs(query(collectionRef, ...queryConstraints))
        console.log(docs)
        return docs
    } catch (err) {
        alert(err.message);
        throw err;
    }
}

const readDocument = (collectionName, cursorId) => {
    return getDoc(doc(collection(firestore, collectionName), cursorId))
}

const updateDocument = (collectionName, id, document) => {
    return updateDoc(doc(collection(firestore, collectionName), id), document)
}

const deleteDocument = (collectionName, id) => {
    return deleteDoc(doc(collection(firestore, collectionName), id))
}

const FirebaseFirestoreService = {
    createDocument,
    readDocuments,
    readDocument,
    updateDocument,
    deleteDocument,
}

export default FirebaseFirestoreService