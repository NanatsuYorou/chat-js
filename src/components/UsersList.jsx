import { List, ListItem } from '@mui/material'
import React from 'react'
import '../scss/chatpage.css'

function UserItem({id, login, selectChat, toggleDrawer}){

    let chats = JSON.parse(localStorage.getItem('chats'))
    if(!Array.isArray(chats))
        chats = []

    const currUser = JSON.parse(sessionStorage.getItem('user'))

    // При нажатии на логин пользователя открыть чат с ним,
    // либо, если такого чата еще нет, создать его
    function handleClick(){

        // Если такой чат уже существует (и это не общий чат) -> вернуть его chatId
        for(let i = 0; i < chats.length; i++){
            if(chats[i].participants.includes(id) && chats[i].participants.includes(currUser.id) && chats[i].chatId !== 1){
                console.log('chat found, chatId:', chats[i].chatId)
                selectChat(chats[i].chatId)
                toggleDrawer(false)
                return
            }
        }

        // Если такого чата еще нет -> создать новый
        let new_chat = {
            participants: [id, currUser.id],
            chatId: new Date().getTime()
        }

        localStorage.setItem('chats', JSON.stringify([...chats, new_chat]))
        toggleDrawer(false)
        selectChat(new_chat.chatId)
        
    }
    
    return(
        <ListItem className='users__item' onClick={handleClick} >
               {login}
        </ListItem>
    )
}

export default function UsersList({users, selectChat, toggleDrawer}) {
  return (
    <List sx={{width: {xs: '320px', sm: '350px', md: '400px', lg: '400px'}}} className='users__list'>
        <ListItem className='users__item' onClick={() => {selectChat(1); toggleDrawer(false)}}>
                Общий чат
        </ListItem>
        {
            users.map(user => (
                <UserItem key={user.id} {...user} selectChat={selectChat} toggleDrawer={toggleDrawer}/>
            ))
        }
    </List>
  )
}
