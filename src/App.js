import { useEffect, useState } from 'react';
import './App.css';
import {Button, EditableText, InputGroup, Toaster} from '@blueprintjs/core'

//Alerte Toast
const AppToaster = Toaster.create({
  position: "top",
})

function App() {

  //State pour récupérer les données d'utilisateurs
  const [users, setUsers] = useState([]);

  //State pour ajouter un utilisateur
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  // AFFICHER LES UTILISATEURS [GET REQUEST]
  //Fetch les données, tableau de dépendance vide pour avoir l'effet qu'une fois
  useEffect(() => {
    // GET REQUEST
    fetch('https://jsonplaceholder.typicode.com/users') // Fetch l'API
      .then((response) => response.json()) // Transformer la réponse en JSON
      .then((json) => setUsers(json)) // Affecter la réponse dans le setUsers
  }, []);


  // AJOUTER UN UTILISATEUR [POST REQUEST]
  function addUser() {
    //Récupérer les valeurs des states (newUser, newEmail, newWebsite)
    const name = newName.trim(); // trim() pour enlever les espaces
    const email = newEmail.trim();
    const website = newWebsite.trim();

    // CONDITION si seulement ces valeurs ne sont pas vide
    if (name && email && website) {
      // POST REQUEST pour ajouter un utilisateur
      fetch('https://jsonplaceholder.typicode.com/users',
        {
          method: "POST",
          body: JSON.stringify({ name, email, website }), // Les données envoyer en JSON
          headers: {"Content-Type": "application/json; chartset=UTF-8"}
        })
        .then((response) => response.json())
        .then(data => {
          setUsers([...users, data]) // On récupère les ancienne donnée en ajoutant les nouvelles
          AppToaster.show({
            message: "Utilisateur ajouter avec succès",
            intent: 'success',
            timeout: '3000'
          })
          // ON VIDE LES CHAMPS UNE FOIS QUE L'AJOUT EST EFFECTUER
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        })
    }

  }


  // RECUPERER LE CHAMPS DE UTILISATEUR QUI VA ETRE MODIFIER
  function onChangeHandler(id, key, value) {
    // On récupere l'utilisateur en paramètre
    setUsers((users) => {
      return users.map(user => {
        // On vérifie si l'id de l'utilisateur est le même que dans le champs
        // On spread l'utilisateur, key fait référence à "email" et value à la valeur
        return user.id === id ? { ...user, [key]: value } : user;
       })
    })
  }

  // METTRE A JOUR UN UTILISATEUR [PUT REQUEST]
  function updateUser(id) {
    const user = users.find((user) => user.id === id);
    
     // PUT REQUEST, on ajoute l'id (L'API a comme maximum 10 utilisateurs donc je laisse 10)
     // Le bon fetch dans une application avec un vrai backend : https://jsonplaceholder.typicode.com/users/${id}
     fetch(`https://jsonplaceholder.typicode.com/users/10`,
        {
          method: "PUT",
          body: JSON.stringify(user), // Les données envoyer en JSON
          headers: {"Content-Type": "application/json; chartset=UTF-8"}
        })
        .then((response) => response.json())
        .then(data => {
          AppToaster.show({
            message: "Utilisateur modifier avec succès",
            intent: 'success',
            timeout: '3000'
          })
        })

  }


  // SUPPRIMER UN UTILISATEUR [DELETE REQUEST]
  function deleteUser(id) {
      fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
        {
          method: "DELETE",
        })
        .then((response) => response.json())
        .then(data => {
          setUsers((prevUsers) => {
            return prevUsers.filter(user => user.id !== id)
          })

          AppToaster.show({
            message: "Utilisateur supprimer avec succès",
            intent: 'success',
            timeout: '3000'
          })
        })
  }


  return (
    <div className="App">
      <h1>CRUD USERS WITH FAKE API</h1>
      <h3>https://jsonplaceholder.typicode.com/users/</h3>
      <hr />

        <table className='bp4-html-table modifier'>
          <thead>
              <th>ID</th>
              <th>NOM</th>
              <th>EMAIL</th>
              <th>SITE</th>
              <th>ACTION</th>
          </thead>
        <tbody>
          {users.map(user =>
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td><EditableText onChange={value => onChangeHandler(user.id, 'email', value)} value={user.email} /></td>
                <td><EditableText onChange={value => onChangeHandler(user.id, 'website', value)} value={user.website} /></td>
                <td className='boutton-off'>
                  <Button onClick={() => updateUser(user.id)} intent='primary'>Mettre à jour</Button>
                  <Button onClick={() => deleteUser(user.id)} intent='danger'>Supprimer</Button>
                </td>
              </tr>
            )}
        </tbody>
          <br /><br />
          <tfoot>
          <tr>
            <td></td>
            <td><InputGroup value={newName} onChange={(e) => setNewName(e.target.value)} placeholder='Entrer un nom..' /></td>
            <td><InputGroup value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder='Entrer un mail..' /></td>
            <td><InputGroup value={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} placeholder='Entrer le site web..' /></td>
            <td><Button onClick={addUser} intent='success'>Ajouter utilisateur</Button></td>
          </tr>
          </tfoot>
      </table>

    </div>
  );
}

export default App;
