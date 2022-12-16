import React, { useEffect, useState } from 'react'
import CSS from '../scss/authpage.css'

export default function AuthPage() {

    const [login, setLogin] = useState('')
    const [users, setUsers] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    
    function handleLogin(e){
        e.preventDefault()

        let error = false

        for(let i = 0; i < users.length; i++){
            if(users[i].login === login){
                error = true
                setErrorMessage('Данный логин уже занят')
                setLogin('')
                break;
            }
        }

        
        if(!error){
            let curr_user = {
                id: new Date().getTime(),
                login
            }
            users.push(curr_user)
            sessionStorage.setItem('user', JSON.stringify(curr_user))
            localStorage.setItem('users', JSON.stringify(users))


            // Добавить нового пользователя в общий чат
            let chats = JSON.parse(localStorage.getItem('chats'))
            if(!Array.isArray(chats)){
                chats = [{
                    chatId: 1,
                    participants: []
                }]
            }     
            for(let i = 0; i < chats.length; i++){
                if(chats[i].chatId == 1){
                    chats[i].participants.push(curr_user.id)
                }
                break
            }       
            localStorage.setItem('chats', JSON.stringify(chats))
            document.location.href += 'chat/' + curr_user.id
        }
    }

    useEffect(() => {
        initUsers()        
    }, [])

    function initUsers(){
        let users_array = JSON.parse(localStorage.getItem('users'))
        if(!Array.isArray(users_array)){
            users_array = []
        }
        setUsers(users_array)
    }
    
    window.addEventListener('storage', initUsers)
    
  return (
    <div className={CSS['container']} >
        <form onSubmit={e => handleLogin(e)}>
            <input type="text" onChange={e => setLogin(e.target.value)}/>
            <button type="submit">Login</button>
            <span>{errorMessage}</span>
        </form>
    </div>
  )
}
