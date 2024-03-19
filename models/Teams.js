const mongoose = require('mongoose')

const TeamsSchema = new mongoose.Schema({
    TeamName:{
        type:String
    }
},{timestamps:true});

const Teams = mongoose.model("teams",TeamsSchema,"Teams");
module.exports = Teams;