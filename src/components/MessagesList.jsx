import { List, ListItem } from '@mui/material'
import React from 'react'
import '../scss/chatpage.css'

export default function MessagesList({activeChatRef, messagesArray}) {
  return (
    <List className='messages__list'>
        {
            activeChatRef.current == null ? (
                <ListItem className='messages__item'>Выберите чат</ListItem>
            ) : (
                messagesArray.length == 0 ? 
                <ListItem className='messages__item'>Сообщений пока нет...</ListItem> : (
                    messagesArray.map((message, index) => (
                        <ListItem className='messages__item' key={index}>{message.login}:{message.text}</ListItem>
                    ))
                )
            ) 
        }
    </List>
  )
}
