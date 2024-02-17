"use client"

import { cn } from '@/lib/utils';
import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('ws://0.0.0.0:8080/martina-ws')
  const [messageHistory, setMessageHistory] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket("ws://0.0.0.0:8080/martina-ws");
  const [prettified, setPrettified] = useState({})

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      console.log(lastMessage)
      setPrettified(JSON.parse(lastMessage.data))
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('wss://demos.kaazing.com/echo'),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);


  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  let transcript = prettified.transcript as []

  
  return (
    <div className='w-full bg-[#f9f9f9] mx-auto max-w-6xl flex-col flex justify-center'>
      <div className='flex flex-row justify-center'>
      <span className={cn('font-bold', connectionStatus === 'Open' ? 'text-green-600' : 'text-black')}>Call {connectionStatus}</span>
      </div>
      <div className='bg-white shadow-lg w-[80%] min-h-screen mx-auto p-12 mt-4 rounded-md ring-2 ring-indigo-300 gap-2 flex flex-col'>
  { transcript && transcript?.map((message, index) => {
    if (message.role === 'user') {
      // Styling for user messages
      return (
        <div key={index} className="bg-blue-900/80 rounded-md p-4 max-w-[70%] ml-auto text-white">
          <p className="text-right">{message.content}</p>
        </div>
      );
    } else if (message.role === 'agent') {
      // Styling for agent messages
      return (
        <div key={index} className="bg-zinc-900/80 rounded-md p-4 max-w-[70%] text-white">
          <p>{message.content}</p>
        </div>
      );
    } else {
      // Fallback or default UI for messages without a specified role
      return (
        <div key={index} className="bg-gray-100 rounded-md p-4 max-w-[70%]">
          <p>{message.content}</p>
        </div>
      );
    }
  })}
</div>

    </div>
  );
};