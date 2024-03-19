import React, { useEffect, useState } from 'react'
import Header from './Header'
import './Fixtures.css'
import { useNavigate } from 'react-router-dom';
import resourcesData from './Resources';
import axios from 'axios'

const Fixtures = () => {
    let cnt = 1;
    const [addFixture,setAddFixture]=useState(false);
    const [newFixtureStatus,setNewFixtureStatus] = useState(false);
    const [Team1,setTeam1]=useState();
    const [Team2,setTeam2]=useState();
    const [MatchDate,setDate]=useState();
    const [Gender,SetGender] = useState('Boys');
    const [newGender,setUpdateGender] = useState('Boys');
    const navigate = useNavigate();
    const [fixtures,setFixtures] = useState(null);

    useEffect(()=>{
            axios.post(`${resourcesData.API_URL}Fixtures`,{MatchGender:Gender}).then((res)=>{
                // console.log(res);
                setFixtures(res.data);
            }).catch((err)=>{
                console.log(err);
            });

            axios.get(`${resourcesData.API_URL}Teams`).then((res)=>{console.log(res.data)});
    },[Gender,newFixtureStatus]);

    
    function handleScoreCard(e){
        const currStatus = fixtures.filter(function(v){return v["MatchID"]===e.target.id&&v["MatchStatus"]==="C";});
        if(currStatus.length!==0&&currStatus[0].status==="C"){
            navigate('/scorecard');
        }
        else {
            // if(userProfile==='Admin'){
                navigate(`/MatchScore/${e.target.id}`)
            // }
            // alert('Match yet to be organised')
        };
    };

    async function handleFixtureSubmit(e){
        if(Team1===undefined||Team2===undefined) return alert('Enter Team Details');
        if(e.target.innerText==='Add'){
            if(handleDate(MatchDate)) return;
            const currTime = Date.now();
            const newMatchId = `${Team1+Team2+currTime}`;
            const matchCurrentFixtures = fixtures.filter((v)=>{
                return (v["MatchDate"]===MatchDate&&((v["TeamA"].TeamName===Team1&&v["TeamB"].TeamName===Team2)||(v["TeamA"].TeamName===Team2&&v["TeamB"].TeamName===Team1))&&v["MatchGender"]===newGender);
            });
            if(matchCurrentFixtures.length!==0) return alert('Match with same details Already Exists!!');
            const newFixture = {
                Set:[],
                MatchID:`${newMatchId}`,
                MatchDate:MatchDate,
                TeamA:{
                    TeamName:Team1,
                    TeamPlayers:["","","",""]
                },
                TeamB:{
                    TeamName:Team2,
                    TeamPlayers:["","","",""]
                },
                MatchStatus:"NC",
                MatchResult:"",
                MatchGender:newGender
            };
            await axios.post(`${resourcesData.API_URL}UpdateFixture`,newFixture,{}).then((res)=>{
                setFixtures(res.data);
            });
        }else{
            const matchCurrentFixtures = fixtures.filter((v)=>{
                return (v["MatchDate"]===MatchDate&&((v["TeamA"].TeamName===Team1&&v["TeamB"].TeamName===Team2)||(v["TeamA"].TeamName===Team2&&v["TeamB"].TeamName===Team1))&&v["MatchGender"]===newGender);
            });
            if(matchCurrentFixtures.length===0) return alert('Match with such details doesn\'t Exist!!');
            await axios.post(`${resourcesData.API_URL}DeleteFixture`,matchCurrentFixtures[0],{}).then((res)=>{
                // console.log(res.data);
                setFixtures(res.data);
            })
        }
        SetGender(newGender);
    }

    function handleDate(e){
        // console.log(e);
        if(!e.match(/(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[1,2])-\d{4}/)) {alert('Enter Date in dd-mm-yyyy format.\nExample:-"01-02-2024"');return 1;}
        const Dates = e.split('-');
        var today = new Date();
        var currDates = [today.getDate(),today.getMonth()+1,today.getFullYear()];
        if(currDates[2]>parseInt(Dates[2])){
            alert('Entered Year already Passed.\nPlease Enter correct Year.');
            return 1;
        } else if((currDates[2]>=parseInt(Dates[2]))&&currDates[1]>parseInt(Dates[1])){
            alert('Entered Month already Passed.\nPlease Enter correct Month.');
            return 1;
        } else if((currDates[2]>=parseInt(Dates[2]))&&(currDates[1]>=parseInt(Dates[1]))&&currDates[0]>parseInt(Dates[0])){
            alert('Entered Date already Passed.\nPlease Enter correct Date.');
            return 1;
        }
        return 0;
    }

    return (
        <>
            <Header/>
            {!addFixture&&<div className='lawnTennis-Fixtures_addnew'>
                <button onClick={()=>{setAddFixture(true);}}>Add / Delete a Fixture</button>
            </div>}
            {addFixture&&
                <div className='lawnTennis-Fixture_addNewFixture'>
                    <div className='lawnTennis-Fixture_addNewClose'><div className='lawnTennis-Fixture_addNewFixtureClosebutton' onClick={()=>{setAddFixture(false);}}>X</div></div>
                    <div className='lawnTennis-Fixture_addNewFixtureHeading'>FIXTURE DETAILS</div>
                    <div className='lawnTennis-Fixture_addNewFixtureInputs'>
                        {/* <select>
                            
                        </select> */}
                            <input onChange={(e)=>{setTeam1(e.target.value);}} type='text'placeholder='Team1 Name' required/>
                            <input onChange={(e)=>{setTeam2(e.target.value);}} type='text' placeholder='Team2 Name' required/>
                            <div className='lawnTennis-Fixture_addNewFixtureInputs_Date'>
                                <label for='Date'>Match Date</label>
                                <input type='text' placeholder='dd-mm-yyyy' onChange={(e)=>{setDate(e.target.value);}} required/>
                            </div>
                            <div>
                                <label>Select Category : </label>
                                <select onChange={(e)=>{setUpdateGender(e.target.value)}} value={newGender}>
                                    <option>Boys</option>
                                    <option>Girls</option>
                                </select>
                            </div>
                            <div className='lawnTennis-Fixture_addNewFixtureSubmit'>
                                <button id='FixtureAdd' onClick={(e)=>{handleFixtureSubmit(e)}}>Add</button>
                                <button id='FixtureDelete' onClick={(e)=>{handleFixtureSubmit(e)}}>Delete</button>
                            </div>
                    </div>
                </div>
            }
            <div className='lawnTennis-Fixtures_heading'>
                <div>Fixtures</div>
                <select onChange={(e)=>{SetGender(e.target.value)}} value={Gender}>
                    <option>Boys</option>
                    <option>Girls</option>
                </select>
            </div>
            <div className='lawnTennis-Fixtures'>
                {fixtures!==null&&
                    fixtures.map((item)=>{
                        return(
                            <div className='lawnTennis-Fixture_item'>
                                <div>{cnt++}.</div>
                                <div className='lawnTennis-Fixture_item_MatchDetails'>
                                    <div>{item.TeamA.TeamName}</div>
                                    <div>vs</div>
                                    <div>{item.TeamB.TeamName}</div>
                                    <div className='lawnTennis-Fixture_item_MatchDate'>{item.MatchDate}</div>
                                </div>
                                {(item.MatchStatus==="C")&&<div className='lawnTennis-Fixture_item_ScorecardButton' id={item.MatchID} onClick={(e)=>{handleScoreCard(e);}}>Scorecard</div>}
                                {(item.MatchStatus==="NC")&&<div className='lawnTennis-Fixture_item_ScorecardButton' id={item.MatchID} onClick={(e)=>{handleScoreCard(e);}}>Organise</div>}
                            </div>
                        )
                    })
                }
                {
                    fixtures===null&&
                    <div className='lawnTennis-Fixture_loading'>
                        <div className='Loading_Circle'></div>
                        <div>Loading Fixtures</div>
                        {/* <h2>Refresh Page</h2> */}
                    </div>
                }
            </div>
        </>
    )
}

export default Fixtures