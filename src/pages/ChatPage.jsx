import { AppBar, Box, Drawer, IconButton, TextField, Toolbar, Typography } from '@mui/material'
import { Container } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import MessagesList from '../components/MessagesList'
import UsersList from '../components/UsersList'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import '../scss/chatpage.css'

export default function ChatPage() {

    const [users, setUsers] = useState([])
    const [message, setMessage] = useState('')
    const [open, toggleDrawer] = useState(false)

    let activeChatRef = useRef(null)
    // В messagesArray хранится массив сообщений для активного чата
    const [messagesArray, setMessagesArray] = useState([])

    // Загрузить массив сообщений для активного чата
    function loadMessages(){
        let all_messages = JSON.parse(localStorage.getItem('messages'))

        
        if(!Array.isArray(all_messages)){
            localStorage.setItem('messages', JSON.stringify([]))
            return
        }
        // Проверка на пустой массив
        else if (all_messages.length == 0){
            setMessagesArray([])
            return
        } else {
            // Если массив сообщений не пустой - выбрать сообщения из нужного чата
            let currentChat_messages = []
            for(let i = 0; i < all_messages.length; i++){
                if(all_messages[i].chatId == activeChatRef.current){
                    currentChat_messages = all_messages[i].messages
                    break
                }
            }
            setMessagesArray(currentChat_messages)
        }
    }
    
    const currUser = JSON.parse(sessionStorage.getItem('user'))

    // Сделать чат активним и загрузить его сообщения
    function selectChat(chatId){
        activeChatRef.current = chatId
        loadMessages()
        // setActiveChat(chatId)
    }

    // Функция отправки сообщения
    function handleSendMessage(e){
        e.preventDefault()

        let messageSended = false
        if(activeChatRef.current == null){
            alert('Вы еще не выбрали чат!')
        } else {
            let sendedMessage = {
                text: message,
                login: currUser.login
            }
            let all_messages = JSON.parse(localStorage.getItem('messages'))
            // Если пустой массив значит это первое сообщение
            if (all_messages.length == 0){
                localStorage.setItem('messages', JSON.stringify(
                    [{
                        chatId: activeChatRef.current,
                        messages: [sendedMessage]
                    }]
                ))
            } else {
                // Иначе добавить в нужный чат
                for(let i = 0; i < all_messages.length; i++){
                    if(all_messages[i].chatId == activeChatRef.current){
                        all_messages[i].messages.push(sendedMessage)
                        messageSended = true
                        break
                    }
                }
                // Массив не пустой, но сообщений в нужном чате еще не было
                if(!messageSended){
                    all_messages.push({
                        chatId: activeChatRef.current,
                        messages: [sendedMessage]
                    })
                }
                localStorage.setItem('messages', JSON.stringify(all_messages))
            }
            setMessage('')
            loadMessages()
        }
    }
    // Один из пользователей вышел 
    // или пришло сообщение - обновить компоненты
    function reloadComponent(){
        updateUsersArray()
        loadMessages()
    }
    
    function updateUsersArray(){
        // Получить список пользователей и убрать оттуда себя
        let users_array = JSON.parse(localStorage.getItem('users'))
        if(users_array.length){
            for(let i = 0; i < users_array.length; i++){
                if(users_array[i].login == currUser.login){
                    users_array.splice(i, 1)
                    break;
                }
            }
        }
        setUsers(users_array)
    }
    
    useEffect(() => {
        // Получить список онлайн пользователей
        updateUsersArray()
        loadMessages()
        // Отслеживать появление новых пользователей
        window.addEventListener('storage', reloadComponent)    
    }, [])
    
    useEffect(() => {
        // Выход при закрытии вкладки
        const unloadCallback = (event) => {
            let cur_user = JSON.parse(sessionStorage.getItem('user'))
            let online_users = JSON.parse(localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify(online_users.filter(user => user.id !== cur_user.id)))
            event.preventDefault();
            event.returnValue = "";
            return "";
        };
        
        window.addEventListener("beforeunload", unloadCallback);
        return () => window.removeEventListener("beforeunload", unloadCallback);
      }, []);

      useEffect(() => {
        // Чтобы не выходило из аккаунта при перезагрузке страницы
        let cur_user = JSON.parse(sessionStorage.getItem('user'))
        let online_users = JSON.parse(localStorage.getItem('users'))
        
        let userLogged = false
        for(let i=0; i<online_users.length; i++){
            if(online_users[i].id == cur_user.id){
                userLogged = true
                break
            }
        }
        if(!userLogged)
            online_users.push(cur_user)

        localStorage.setItem('users', JSON.stringify(online_users))
      })
    
  return (
    <Box sx={{height: '100%'}}>
        <AppBar position='static' sx={{height: {xs: '10%', sm: '50px', md: '60px'}}}>
            <Toolbar sx={{height: '100%', minHeight: '0px'}}>
                <IconButton onClick={() => toggleDrawer(true)}>
                    <ArrowBackIcon/>
                </IconButton>
                <Typography>
                    Чат для одного
                </Typography>
            </Toolbar>
        </AppBar>
        <Container className="container" sx={{height: '90%'}}>
            <Drawer anchor='left' open={open}  onClose={() => toggleDrawer(false)} className='users'>
                <Typography sx={{padding: '10px'}} component={'h3'} variant={'span'}>
                    Список пользователей
                </Typography>
                <UsersList users={users} selectChat={selectChat} toggleDrawer={toggleDrawer}/>
            </Drawer>
            <Box onClick={() => toggleDrawer(false)} className='chat' sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <Box sx={{flexGrow: 1, paddingTop: '10px', overflow: 'auto'}} className="chat__messages" >
                    <MessagesList activeChatRef={activeChatRef} messagesArray={messagesArray}/>
                </Box>
                <Box className="chat__input">
                    <form onSubmit={e => handleSendMessage(e)}>
                        <TextField sx={{width: '85%'}} placeholder="Введите ваше сообщение..." value={message} onChange={e => setMessage(e.target.value)} />
                        <IconButton sx={{width: '15%'}} onClick={e => handleSendMessage(e)}>
                            <SendIcon/>
                        </IconButton>
                    </form>
                </Box>
            </Box>
        </Container>
    </Box>
  )
}
