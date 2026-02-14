import React from 'react'
import {Box}from 'lucide-react'
import { spawn } from 'child_process';
import Button from './ui/Button'

const Navbar = () => {
  const signedin = true;
  const greetings = ["hi", "helloo", "hiii", "bonjor", "welcome", "yo✌️"]
  const usernames = ["lightning", "sekiro", "Arthur morgan", "Jojo"]
  const randomIndex = Math.floor(Math.random() * usernames.length);
  const randomGreeting = Math.floor(Math.random() * greetings.length);
  const username = usernames[randomIndex];
  const greeting = greetings[randomGreeting];

  async function handleAuthClick() {
    throw new Error('Function not implemented.')
  }

  return (
    <header className='navbar'>
      <nav className='inner'>
        <div className='left'>
          <div className='brand'>
            <Box className="logo"/>
            <span className='name'>
              Stateless
            </span>
          </div>

          <ul className='links'>
              <a href="">Product</a>
              <a href="">Pricing</a>
              <a href="">Community</a>
              <a href="">Enterprise</a>
          </ul>
        </div>

        <div className='actions'>
        {signedin ? (
          <>
          <span className='greeting'>
            {username ? `${greeting} ${username}` : `Signed in`}
          </span>
          <Button size='sm' onClick={handleAuthClick}>Log out</Button>

          </>
        ):(
          <>          
          <Button size='sm' variant="ghost" onClick={handleAuthClick}>
            Login
          </Button>

          <a href="#uplaod" className='cta'>
            Get Started
          </a>
          </>
        )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar