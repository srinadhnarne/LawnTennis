import './MatchScoring.css'
import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Header from './Header';
import { FaRegEdit } from "react-icons/fa";
import axios from 'axios'
import resources from './Resources'

const MatchScoring = () => {
    const MatchId = useParams().matchId;
    // console.log(MatchId);
    let arr=[0,1,2,3];
    const [TeamA,setTeamA]=useState();
    const [TeamB,setTeamB]=useState();
    const[TeamNames,setTeams]=useState(["",""]);
    let prevIDA=null,prevIDB=null;
    const [TeamsDetails,setTeamsDetails]=useState(false);
    const [Sets,setAddNewSet] = useState([]);
    // const [initialDetails,setInitials] = useState();
    // const [Games,setAddGames] = useState([]);
    const pointsArr=[0,1,2,3,4];

    useEffect(()=>{
        axios.post(`${resources.API_URL}initialData`,{MatchId}).then((res)=>{
            setTeams([res.data.TeamA.TeamName,res.data.TeamB.TeamName]);
            if(res.data.Set!=null) setAddNewSet(res.data.Set);
            handleInputInitials();
        })
    },[MatchId]);

    // useEffect(()=>{
    //     axios.post(`${resources.API_URL}initialData`,{MatchId}).then((res)=>{
    //         if(res.data.Set!=null) setAddNewSet(res.data.Set);
    //     })
    // },[Sets]);


    async function handleDropDown(e){
        const temp = document.getElementsByClassName(`lawnTennis-MatchScoring_addnewGame${e.id}`)[0].classList;
        if(temp.contains('removeDiv')) temp.remove('removeDiv');
        else temp.add('removeDiv');
    };

    async function handleScoreChange(e){
        //MatchID-Set-Game-Score-Team
        const LIID = e.target.id.split('-');
        if(LIID[4]==='A'){
            const prevLIID = prevIDA?prevIDA.split('-'):null;
            if(prevLIID&&prevLIID[2]===LIID[2]){
                document.getElementById(prevIDA).classList.remove('addBackground');
            }else if(prevLIID&&prevLIID[2]!==LIID[2]){
                let i =1;
                while(document.getElementById(`${LIID[0]+'-'+LIID[1]+'-'+LIID[2]+'-'+(15*i)+'-'+LIID[4]}`)){
                    let colorCheck = document.getElementById(`${LIID[0]+'-'+LIID[1]+'-'+LIID[2]+'-'+(15*i)+'-'+LIID[4]}`).classList;
                    if(colorCheck) colorCheck.remove('addBackground');
                    i++;
                }
            }
            prevIDA = e.target.id;
            document.getElementById(prevIDA).classList.add('addBackground');
        } else {
            const prevLIID = prevIDB?prevIDB.split('-'):null;
            if(prevLIID&&prevLIID[2]===LIID[2]){
                document.getElementById(prevIDB).classList.remove('addBackground');
            }else if(prevLIID&&prevLIID[2]!==LIID[2]){
                let i =1;
                while(document.getElementById(`${LIID[0]+'-'+LIID[1]+'-'+LIID[2]+'-'+(15*i)+'-'+LIID[4]}`)){
                    let colorCheck = document.getElementById(`${LIID[0]+'-'+LIID[1]+'-'+LIID[2]+'-'+(15*i)+'-'+LIID[4]}`).classList;
                    if(colorCheck) colorCheck.remove('addBackground');
                    i++;
                }
            }
            prevIDB = e.target.id;
            document.getElementById(prevIDB).classList.add('addBackground');
        }
        await axios.post(`${resources.API_URL}pointUpdate`,{
                LIID
        });
    }

    async function handleWinGame(e){
        // console.log(e.target.id);
        if(e.target.value!=="Select"){
            await axios.post(`${resources.API_URL}gameWin`,{
                LIID:e.target.id,
                Result:e.target.value
            }).then((res)=>{
                setAddNewSet(res.data.Set);
            });
        }
    }

    function handleAddNewGame(e){
        const LIID = e.target.parentNode.parentNode.id.split("-");
        let index = LIID[1];
        console.log(LIID[1]);
        const newState = Sets.map((item,i)=>{
            // console.log(item,i,index);
            if(i===parseInt(index)){
                return {scores:{
                    TeamA:[...Sets[index].scores.TeamA,"0"],
                    TeamB:[...Sets[index].scores.TeamB,"0"]
                },results:[...Sets[index].results,""]}
            }
            else {
                return {...item}
            }
        });
        setAddNewSet(newState);
    }

    function handleAddNewSet(){
        setAddNewSet([...Sets,
            {
                scores:{
                    TeamA:[],
                    TeamB:[]
                },
                results:[],
                setResult:""
            }
        ]);
        // console.log(Sets);
    }

    async function handleWinSet(e){
        // console.log(e.target.value,e.target.id);
        if(e.target.value==="Select") return alert('Please Select the Team to Update');
        const LIID = e.target.id.split('-');
        LIID.push(e.target.value);
        // console.log(LIID);
        await axios.post(`${resources.API_URL}setWin`,{
            LIID
        });
        const newState = Sets.map((item,i)=>{
            if(i===parseInt(LIID[1])){
                return {scores:{
                    TeamA:[...Sets[LIID[1]].scores.TeamA],
                    TeamB:[...Sets[LIID[1]].scores.TeamB]
                    },results:[...Sets[LIID[1]].results],
                    setResult:LIID[3]
                }
            }
            else {
                return {...item}
            }
        });
        setAddNewSet(newState);
    }

    async function handleInputInitials(){
        const PlayerDetails = await axios.post(`${resources.API_URL}PlayersList`,{
            MatchId
        });
        const value = [PlayerDetails.data[0],PlayerDetails.data[1]];
        setTeamA(value[0]);
        setTeamB(value[1]);
        const data = await (document.getElementsByClassName('lawnTennis-MatchScoring_AddTeamPlayerDetails'));
        for(let i = 0; i <2;i++){
            for(let j = 0; j < 4; j++){
                data[i].children[j].value=value[i][j];
            }
        }
    }

    async function handleAddTeamDetails(){
        const TeamPlayers =[["","","",""],["","","",""]];
        for(let i = 0; i < 4; i++){
            TeamPlayers[0][i]=document.getElementById(`TeamAPlayer${i+1}`).value;
            TeamPlayers[1][i]=document.getElementById(`TeamBPlayer${i+1}`).value;
        }
        // console.log(TeamPlayers);
        setTeamA(TeamPlayers[0]);
        setTeamB(TeamPlayers[1]);
        if(TeamPlayers[0][0]===''||TeamPlayers[0][1]===''||TeamPlayers[0][2]===''||TeamPlayers[0][3]===''||TeamPlayers[1][0]===''||TeamPlayers[1][1]===''||TeamPlayers[1][2]===''||TeamPlayers[1][3]==='') return alert('Enter All Player Details.');
        setTeamsDetails(true);
        await axios.post(`${resources.API_URL}updateTeamPlayers`,{
            MatchId,TeamA:`${TeamPlayers[0]}`,TeamB:`${TeamPlayers[1]}`
        });
    }

    return (
        <div>
            <Header/>
            <div className='lawnTennis-MatchScoring'>
                <div>
                    {!TeamsDetails&&<div>
                        <div className='lawnTennis-MatchScoring_heading'>Enter Team Details</div>
                        <div className='lawnTennis-MatchScoring_AddDetails'>
                            <div>
                                <div className='lawnTennis-MatchScoring_teamDetails'>{TeamNames[0]}</div>
                                <div className='lawnTennis-MatchScoring_AddTeamPlayerDetails'>
                                    {arr.map((i)=>{
                                        return (
                                            <input type='text' id={`TeamAPlayer${i+1}`} placeholder={`Player ${i+1}`} required/>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <div className='lawnTennis-MatchScoring_teamDetails'>{TeamNames[1]}</div>
                                <div className='lawnTennis-MatchScoring_AddTeamPlayerDetails'>
                                    {arr.map((i)=>{
                                        return (
                                            <input type='text' id={`TeamBPlayer${i+1}`} placeholder={`Player ${i+1}`} required/>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='lawnTennis-MatchScoring_AddButton'>
                            <button onClick={()=>{handleAddTeamDetails();}}>Add/Edit</button>
                        </div>
                    </div>}
                    {TeamsDetails&&<div className='lawnTennis-MatchScoring_heading'>Match Details</div>}
                    {TeamsDetails&&<div className='lawnTennis-MatchScoring_EditIcon' onClick={()=>{setTeamsDetails(false);handleInputInitials();}}>{<FaRegEdit />}</div>}
                    {TeamsDetails&&<div className='lawnTennis-MatchScoring_Details'>
                        <div>
                            <div className='lawnTennis-MatchScoring_teamDetails'>{TeamNames[0]}</div>
                            <div className='lawnTennis-MatchScoring_teamPlayerDetails'>
                                <ul>
                                    {
                                        TeamA.map((item)=>{
                                            return(
                                                <li>{item}</li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className='lawnTennis-MatchScoring_vs'>vs</div>
                        <div>
                            <div className='lawnTennis-MatchScoring_teamDetails'>{TeamNames[1]}</div>
                            <div className='lawnTennis-MatchScoring_teamPlayerDetails'>
                                <ul>
                                    {
                                        TeamB.map((item)=>{
                                            return(
                                                <li>{item}</li>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            {/* {console.log(Sets)} */}
            {
                Sets.map((item,temp)=>{
                    return(
                    <div className={`lawnTennis-MatchScoring_Set`} id={`${MatchId}-${temp}`}>
                        <div className='lawnTennis-MatchScoring_SetHeader'  onClick={(e)=>{handleDropDown(e.target.parentNode);}}>
                            <div className='lawnTennis-MatchScoring_SetHeading' >Set {temp+1}</div>
                        </div> 
                        <div className={`lawnTennis-MatchScoring_addnewGame lawnTennis-MatchScoring_addnewGame${MatchId}-${temp} removeDiv`}>
                            <button onClick={(e)=>{handleAddNewGame(e);}}>Add a New Game</button>
                            <div className={`lawnTennis-MatchScoring_addnewGameMain${MatchId}-${temp}`}>
                                <div className={`lawnTennis-MatchScoring_addnewGameInner`} id={`lawnTennis-MatchScoring_addnewGameInner${MatchId}-${temp}`}>
                                    <div className={`lawnTennis-MatchScoring_addnewGameTeam1`} id={`lawnTennis-MatchScoring_addnewGameTeam1${MatchId}-${temp}`}>
                                        <div className={`lawnTennis-MatchScoring_addnewGameHeading`}>Team A</div>
                                        {item.results&&item.results.map((value,index)=>{
                                            return(
                                                <div className='lawnTennis-MatchScoring_addnewGameScore' >
                                                        <ul onClick={(e)=>{handleScoreChange(e);}}>
                                                            {
                                                                pointsArr.map((i)=>{
                                                                    if(i!==4) {
                                                                        if(15*i==item.scores.TeamA[index]){
                                                                            return(<li id={`${MatchId}-${temp}-${index}-${15*(i)}-A`} className='addBackground' >{15*(i)}</li>)
                                                                        } else {
                                                                            return (<li id={`${MatchId}-${temp}-${index}-${15*(i)}-A`} >{15*(i)}</li>)
                                                                        }
                                                                    }
                                                                    else{
                                                                        if(item.scores.TeamA[index]==="AD"){
                                                                            return(<li id={`${MatchId}-${temp}-${index}-AD-A`} className='addBackground'>AD</li>)
                                                                        } else {
                                                                            return (<li id={`${MatchId}-${temp}-${index}-AD-A`} >AD</li>)
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        </ul>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className={`lawnTennis-MatchScoring_addnewGameTeam2`} id={`lawnTennis-MatchScoring_addnewGameTeam2${MatchId}-${temp}`}>
                                        <div className={`lawnTennis-MatchScoring_addnewGameHeading`}>Team B</div>
                                        {item.results&&item.results.map((value,index)=>{
                                            return(
                                                <div className='lawnTennis-MatchScoring_addnewGameScore' >
                                                        <ul onClick={(e)=>{handleScoreChange(e);}}>
                                                            {
                                                                pointsArr.map((i)=>{
                                                                    if(i!==4) {
                                                                        if(15*i==item.scores.TeamB[index]){
                                                                            return(<li id={`${MatchId}-${temp}-${index}-${15*(i)}-B`} className='addBackground' >{15*(i)}</li>)
                                                                        } else {
                                                                            return (<li id={`${MatchId}-${temp}-${index}-${15*(i)}-B`} >{15*(i)}</li>)
                                                                        }
                                                                    }
                                                                    else{
                                                                        if(item.scores.TeamB[index]==="AD"){
                                                                            return(<li id={`${MatchId}-${temp}-${index}-AD-B`} className='addBackground'>AD</li>)
                                                                        } else {
                                                                            return (<li id={`${MatchId}-${temp}-${index}-AD-B`} >AD</li>)
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        </ul>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className={`lawnTennis-MatchScoring_addnewGameCount`} id={`lawnTennis-MatchScoring_addnewGameCount${MatchId}-${temp}`}>
                                        <div className={`lawnTennis-MatchScoring_addnewGameHeading`}>Team Won</div>
                                        {item.results&&item.results.map((value,index)=>{
                                            return(
                                                <div className='lawnTennis-MatchScoring_addnewGameGameCount'>
                                                    <div>
                                                        <select id={`${MatchId+'-'+temp+'-'+index+'-Win'}`} value={value} onChange={(e)=>{handleWinGame(e);}}>
                                                            <option>Select</option>
                                                            <option>Team A</option>
                                                            <option>Team B</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className='lawnTennis-MatchScoring_SetResult'>
                                <label>Set {temp+1} Result:</label>
                                <select id={`${MatchId+'-'+temp+'-Win'}`} value={Sets[temp].setResult} onChange={(e)=>{handleWinSet(e);}}>
                                    <option>Select</option><option>Team A</option><option>Team B</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    )
                })
            }
            {TeamsDetails&&<div className='lawnTennis-MatchScoring_addnewSet'>
                <button onClick={()=>{handleAddNewSet();}}>Add a New Set</button>
            </div>}
            
        </div>
    )
}

export default MatchScoring;