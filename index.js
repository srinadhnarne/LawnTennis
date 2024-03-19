const express = require('express')
const app = express();
const cors = require('cors');
require("dotenv").config

//Database Integration
require("./mongodb.js")
const MatchScores = require('./models/matchScore.js');
const Teams = require('./models/Teams.js')

app.use(express.json())
app.use(cors());

app.get('/Teams',async(req,res)=>{
    const TeamsData = await Teams.find({});
    // console.log(TeamsData);
    res.json(TeamsData);
});

app.post('/Fixtures',async (req,res)=>{
    const fixtures = await MatchScores.find({MatchGender:req.body.MatchGender});
    // console.log(req.body.MatchGender);
    res.json(fixtures);
});

app.post('/test',(req,res)=>{
    res.json("Successfully Tested");
})

app.post('/initialData',async (req,res)=>{
    // console.log(req.body);
    const MatchID = req.body.MatchId;
    const InitialData = await MatchScores.findOne({"MatchID":MatchID});
    res.json(InitialData);
});

app.post('/gameWin',async (req,res)=>{
    // MatchID,Set,Game,Win
    // Set[]->results[]
    const LIID = req.body.LIID.split('-');
    const TeamWon = req.body.Result;
    console.log(LIID,TeamWon);
    let myupDate = {};
    myupDate["Set."+LIID[1]+".results."+LIID[2]]=TeamWon;
    await MatchScores.findOneAndUpdate({MatchID:LIID[0]},{
        "$set":myupDate
    },{});
    const InitialData = await MatchScores.findOne({"MatchID":LIID[0]});
    res.json(InitialData);
});

app.post('/addNewSet',async (req,res)=>{
    //Database - Set->SetNo[]->TeamA/B->score[]
    const MatchID = req.body.MatchID;
    const SetNo = req.body.SetNo;
    let myupDate = {};
    myupDate["Set."+SetNo]={
        scores:{
            TeamA:[""],
            TeamB:[""]
        },
        results:[""],
        setResult:""
    };
    await MatchScores.findOneAndUpdate({"MatchID":MatchID},
        {"$set":myupDate},{}
    );
    const data = await MatchScores.findOne({"MatchID":MatchID});
    res.json(data);
});

//To send Player Data
app.post('/PlayersList', async (req,res)=>{
    const MatchID = req.body.MatchId;
    const MatchingData = await MatchScores.findOne({"MatchID":MatchID});
    // console.log(MatchingData);
    const PlayerData = [MatchingData.TeamA.TeamPlayers,MatchingData.TeamB.TeamPlayers];
    res.json(PlayerData);
});

//To update playerDetails
app.post('/updateTeamPlayers',async (req,res)=>{
    const MatchID = req.body.MatchId;
    const TeamA = req.body.TeamA.split(',');
    const TeamB = req.body.TeamB.split(',');
    let myupDate = {}
    myupDate["TeamA.TeamPlayers"]=TeamA;
    myupDate["TeamB.TeamPlayers"]=TeamB;
    await MatchScores.findOneAndUpdate({"MatchID":MatchID},
        {"$set":myupDate},{}
    );
    const data = await MatchScores.findOne({MatchID:MatchID});
    res.json(data);
});

app.post('/pointUpdate',async (req,res)=>{
    // MatchID-Set-Game-Score-Team
    const LIID = req.body.LIID;
    console.log(LIID)
    //Database - Set[]->scores->TeamA/B[]=x
    let myupDate = {}
    myupDate["Set."+LIID[1]+".scores.Team"+LIID[4]+"."+LIID[2]]=LIID[3]
    await MatchScores.findOneAndUpdate({"MatchID":`${LIID[0]}`},
        {"$set":myupDate},{}
    );
    
});

app.post('/setWin',async(req,res)=>{
    console.log(req.body.LIID);
    const LIID = req.body.LIID;
    // LIID= [MatchID,Set,Win,TeamA/B]
    let myupDate = {}
    myupDate["Set."+LIID[1]+".setResult"]=LIID[3]
    await MatchScores.findOneAndUpdate({MatchID:LIID[0]},
        {"$set":myupDate},
    {}).then((val)=>{
        // console.log(val);
        res.json(val);
    });
})

app.post('/UpdateFixture',async(req,res)=>{
    console.log(req.body);
    const MatchGender = req.body.MatchGender;
    const Match = new MatchScores(req.body);
    await Match.save();
    const Fixtures = await MatchScores.find({MatchGender:MatchGender});
    res.json(Fixtures);
});

app.post('/DeleteFixture',async(req,res)=>{
    console.log(req.body);
    const MatchGender = req.body.MatchGender;
    await MatchScores.findOneAndDelete({"MatchID":`${req.body.MatchID}`});
    const Fixtures = await MatchScores.find({MatchGender:MatchGender});
    res.json(Fixtures);
});

app.listen(5000,()=>{
    console.log('Port connected to 5000');
})