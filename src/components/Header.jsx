import React from 'react'
import {useNavigate} from 'react-router-dom'
import './Header.css'
import image from './NITJamshedpurlogo.png'

const Header = () => {
    const navigate = useNavigate();

    return (
    <div className='lawnTennis-Header'>
        <div className='lawnTennis-Header1'>
            <div className='lawnTennis-Header_image'>
                <img src={image} alt='NIT_Logo'/>
            </div>
            <div className='lawnTennis-Header_text'>
                <div>LAWN</div><div>TENNIS</div>
            </div>
            <div className='lawnTennis-Header_image'>
                <img src={image} alt='Tennis_Logo'/>
            </div>
        </div>
        <div className='lawnTennis-Header2'>
            <ul>
                <li onClick={()=>{navigate('/')}}>Home</li>
                <li onClick={()=>{navigate('/Teams')}}> Teams</li>
                <li onClick={()=>{navigate('/Fixtures')}}>Fixtures</li>
                {<button id='login_button' onClick={()=>{navigate('/login')}}>Login</button>}
                {/* {<button id='logout_button' onClick={()=>{navigate('/')}}>Logout</button>} */}
            </ul>
        </div>
    </div>
  )
}

export default Header