import { List, ListItem, Typography } from '@mui/material'
import React from 'react'
import '../scss/chatpage.css'

export default function MessagesList({activeChatRef, messagesArray}) {
  return (
    <List className='messages__list' >
        {
            activeChatRef.current == null ? (
                <ListItem className='messages__item'>Выберите чат</ListItem>
            ) : (
                messagesArray.length == 0 ? 
                <ListItem className='messages__item'>Сообщений пока нет...</ListItem> : (
                    messagesArray.map((message, index) => (
                        <ListItem className='messages__item' key={index}>
                            <Typography sx={{fontWeight: 700, pr: '10px', wordBreak: 'keep-all'}}>
                                {message.login}:
                            </Typography>
                            <Typography sx={{wordBreak: 'break-all'}}>
                                {message.text}
                            </Typography>
                        </ListItem>
                    ))
                )
            ) 
        }
    </List>
  )
}
