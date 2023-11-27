import React from 'react'
import { db } from '../../firebase';
import { getDoc,doc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const PartnersEdit = () => {
    const { id:documentId } = useParams();
    console.log(documentId);
    const fetchDataById = async (documentId) => {
        try {
          const docRef = doc(db, 'partners', documentId); // Replace 'yourCollectionName' with your collection name
          const docSnap = await getDoc(docRef);
      
          if (docSnap.exists()) {
            // Data found for the given ID
            console.log('Document data:', docSnap.data());
            return docSnap.data(); // Returning the document data
          } else {
            // Document doesn't exist
            console.log('No such document!');
            return null;
          }
        } catch (error) {
          console.error('Error getting document:', error);
          return null;
        }
      };


      fetchDataById(documentId)
  .then((data) => {
    // Itt kezeld az adatokat, amiket a függvény visszaad
    console.log('Received data:', data);
    // További műveletek a visszakapott adatokkal
  })
  .catch((error) => {
    // Kezeljük az esetleges hibát
    console.error('Error fetching data:', error);
  });
    


  return (
    <div>PartnersEdit</div>
  )
}

export default PartnersEdit