import React from 'react'

export default function ShowStateInformation({ stateMessage }) {
  return (
    <span className={`stateInformation ${(stateMessage.status >= 200 && stateMessage.status < 300) ? 'success' : 'error'}`}>
        <i className={`icon-${(stateMessage.status >= 200 && stateMessage.status < 300) ? 'ok' : 'attention'}`}></i>
        {stateMessage.message}
    </span>
  )
}
