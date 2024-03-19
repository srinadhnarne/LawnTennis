import React, { useEffect, useState } from 'react'
import axios from 'axios'
import resourcesData from './Resources'
import Header from './Header'
import './Teams.css'

const Teams = () => {
    const [Teams,SetTeams] = useState();

    useEffect(()=>{
        axios.get(`${resourcesData.API_URL}Teams`).then((res)=>{
            // console.log(res.data)
            SetTeams(res.data);
        });
    },[]);

    function handleDropdown(e){
        console.log(e);
        const temp = document.getElementsByClassName(`lawnTennis-TeamDetails${e.id}`)[0].classList;
        console.log(temp);
        if(temp.contains('removeDiv')) temp.remove('removeDiv');
        else temp.add('removeDiv');
    }

    return (
        <>
            <Header/>
            <div className='lawnTennis-Teams'>
                <div>Teams</div>
            </div>
            {Teams&&Teams.map((item,index)=>{
                return(
                    <div className='lawnTennis-TeamsItem' id={`${index}`} >
                        <div className='lawnTennis-TeamsItem_TeamName' onClick={(e)=>{handleDropdown(e.target.parentNode.parentNode)}}>
                            <div>{item.TeamName}</div>
                        </div >
                        <div className={`lawnTennis-TeamDetails${index} removeDiv`}>Check</div>
                    </div>
                )
            })}
        </>
    )
}

export default Teams