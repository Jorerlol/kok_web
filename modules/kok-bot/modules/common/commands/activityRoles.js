"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const inactiveTracker = require('../../inactive-tracker');
const help = require("./help");

class ActivityRoles {

    exec(msg, commandArguments) {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length > 0) {
            let command = argsArray[0].toLowerCase();

            if (this[command]) {
                this[command](msg, argsArray)
            } else {
                msg.channel.sendMessage("Unknown command");
            }
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    add(msg, argsArray) {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let activityRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return inactiveTracker.activityRoles.add(activityRoleID, thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    remove(msg, argsArray) {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let activityRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return inactiveTracker.activityRoles.remove(activityRoleID, thisGuild);
                })
                .then(() => msg.channel.sendMessage(responseDict.success()))
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }

    list(msg, argsArray) {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => inactiveTracker.activityRoles.list(msg.guild.id))
                .then(res => {
                    if (res) {
                        msg.channel.sendMessage(res)
                            .catch(err => logger.log(err));
                    } else {
                        msg.channel.sendMessage(responseDict.fail())
                            .catch(err => logger.log(err));
                    }
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.sendMessage(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else {
            msg.channel.sendMessage(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Adds,Removes the specified role as role that should be tracked for activity purposes";
let template = "activityroles <add|remove|list> <role Id>";
let example = [
    "`-activityroles add 1234567890`",
    "`-activityroles remove 1234567890`",
    "`-activityroles list`"];

help.AddHelp("activityroles", helpMessage, template, example);

module.exports = new ActivityRoles();