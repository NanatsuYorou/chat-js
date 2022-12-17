import { Button, TextField } from '@mui/material'
import { Box, Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import CSS from '../scss/authpage.css'

export default function AuthPage() {

    const [login, setLogin] = useState('')
    const [users, setUsers] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    
    function handleLogin(){
        
        if(login.trim() == ''){
            console.log(login)
            setErrorMessage('Некорректный логин')
            setLogin('')
            return
        }

        for(let i = 0; i < users.length; i++){
            if(users[i].login === login){
                setErrorMessage('Данный логин уже занят')
                setLogin('')
                return;
            }
        }

        
        if(errorMessage === ''){
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

    function handleEnterPressed(event){
        if(event.keyCode == 13){
            handleLogin()
        }
    }
    
    window.addEventListener('storage', initUsers)
    
  return (
    <Box sx={{display: 'flex', alignItems: 'center', height: '100%'}}>
        <Container sx={{display: 'flex', flexDirection: 'column', width: {xs: '300px', sm: '400px', md: '500px'}}}>
                <TextField id='login' value={login} error={errorMessage !== ''} helperText={errorMessage} onChange={e => setLogin(e.target.value)} placeholder={'Введите логин...'} onKeyDown={event => handleEnterPressed(event)}></TextField>
                <Button variant="standart" onClick={handleLogin}>Войти</Button>
        </Container>
    </Box>
  )
}
