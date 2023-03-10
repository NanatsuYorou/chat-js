import { List, ListItem, Typography } from '@mui/material'
import React from 'react'
import '../scss/chatpage.css'

export default function MessagesList({activeChatRef, messagesArray}) {
  return (
    <List >
        {
            activeChatRef.current == null ? (
                <ListItem >Выберите чат</ListItem>
            ) : (
                messagesArray.length == 0 ? 
                <ListItem >Сообщений пока нет...</ListItem> : (
                    messagesArray.map((message, index) => (
                        <ListItem  key={index}>
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
