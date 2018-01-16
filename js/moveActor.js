var rotationA = Math.cos(Math.PI / 20);
var rotationB = Math.sin(Math.PI / 20);
function moveActor(actor) {
    const area = actor.area;
    if (!area) {
        return;
    }
    var delta = frameMilliseconds / 1000;
    if (actor.isDead || actor.stunned || actor.pull || ifdefor(actor.stationary) || (actor.skillInUse && actor.preparationTime < actor.skillInUse.totalPreparationTime)) {
        return;
    }
    var goalTarget = (actor.skillInUse && actor.skillTarget !== actor) ? actor.skillTarget : null;
    actor.isMoving = false;
    var speedBonus = 1;
    if (actor.chargeEffect) {
        goalTarget = actor.chargeEffect.target;
    } else if (actor.activity) {
        switch (actor.activity.type) {
            case 'move':
                if (getDistanceBetweenPointsSquared(actor, actor.activity) < 10
                    || (actor.character && actor.character.paused && !mouseDown)
                ) {
                    actor.activity = null;
                    break;
                }
                goalTarget = null;
                // If the actor is currently using a skill, they cannot adjust their heading,
                // but we do allow them to move forward/backward in their current direction at 25% speed
                // if they are in recovery.
                if (actor.skillInUse) {
                    if (actor.heading[0] * (actor.activity.x - actor.x) < 0) {
                        speedBonus = -.1;
                    } else {
                        speedBonus = .25;
                    }
                } else {
                    actor.heading = [actor.activity.x - actor.x, 0, actor.activity.z - actor.z];
                }
                actor.isMoving = true;
                break;
            case 'interact':
                if (getDistanceOverlap(actor, actor.activity.target) <= 5) {
                    if (actor.activity.target.action) {
                        actor.activity.target.action(actor);
                    }
                    actor.activity = null;
                    break;
                }
                actor.heading = [actor.activity.target.x - actor.x, 0, actor.activity.target.z - actor.z];
                if (isNaN(actor.heading[0])) debugger;
                actor.isMoving = true;
                break;
            case 'attack':
            case 'action':
                goalTarget = actor.activity.target;
                break;
        }
    }
    if ((actor.chargeEffect || (actorShouldAutoplay(actor) && !actor.activity)) && (!goalTarget || goalTarget.isDead)) {
        var bestDistance = actor.aggroRadius || 10000;
        actor.enemies.forEach(function (target) {
            if (target.isDead) return;
            var distance = getDistance(actor, target);
            if (distance < bestDistance) {
                bestDistance = distance;
                goalTarget = target;
            }
        });
    }
    if (!goalTarget && actor.owner) {
        // Set desired relative position to ahead if there are enemies and to follow if there are none.
        var pointPosition = actor.owner.enemies.length
            ? {x: actor.owner.x + actor.owner.heading[0] * 300, y: 0, z: Math.max(-180, Math.min(180, actor.owner.z + actor.owner.heading[2] * 100))}
            : {x: actor.owner.x - actor.owner.heading[2] * 200, y: 0, z: actor.owner.z > 0 ? actor.owner.z - 150 : actor.owner.z + 150};
        var distanceToGoal = getDistance(actor, pointPosition);
        if (distanceToGoal > 20) {
            // Minions tend to be faster than their owners, so if they are following them they will stutter as they
            // try to match the desired relative position. To prevent this from happening, we slow minions down as they approach
            // their desired position so the don't reach it.
            speedBonus *= Math.min(1, distanceToGoal / 80);
            //goalTarget = pointPosition;
            setActorInteractionTarget(actor, pointPosition);
            //goalTarget = {x: actor.owner.x + actor.owner.heading[0] * 200, y: 0, z: actor.owner.z + actor.owner.heading[2] * 200};
        }
    }
    if (goalTarget) {
        actor.heading = [goalTarget.x - actor.x, 0, goalTarget.z - actor.z];
                if (isNaN(actor.heading[0])) debugger;
        actor.heading[2] -= actor.z / MAX_Z;
        actor.isMoving = true;
        actor.goalTarget = goalTarget;
        // This was an attempt to move away from targets when they are dying.
        /*if ((!actor.activity || actor.activity.target !== goalTarget) && goalTarget.targetHealth < 0) {
            console.log('run');
            actor.heading[0] = -actor.heading[0];
            actor.heading[2] = -actor.heading[2];
        }*/
    } else {
        actor.goalTarget = null;
    }
    actor.heading = new Vector(actor.heading).normalize().getArrayValue();
                if (isNaN(actor.heading[0])) debugger;
    if (!actor.isMoving) {
        return;
    }
    if (actor.chargeEffect) {
        speedBonus *= actor.chargeEffect.chargeSkill.speedBonus;
        actor.chargeEffect.distance += speedBonus * actor.speed * Math.max(MIN_SLOW, 1 - actor.slow) * delta;
        // Cancel charge if they run for too long.
        if (actor.chargeEffect.distance > 2000) {
            actor.chargeEffect = null;
        }
    } else if (goalTarget && !goalTarget.cloaked) {
        // If the character is closer than they need to be to auto attack then they can back away from
        // them slowly to try and stay at range.
        var skill = actor.skillInUse || (actor.activity && actor.activity.action) || getBasicAttack(actor);
        var skillRange = skill.range || .5;
        var distanceToTarget = getDistanceOverlap(actor, goalTarget);
        // Set the max distance to back away to to 10, otherwise they will back out of the range
        // of many activated abilities like fireball and meteor.
        if (distanceToTarget < (Math.min(skillRange - 1.5, 10)) * 32 || goalTarget.targetHealth < 0) {
            // Actors backing away from their targets will eventually corner themselves in the edge of the room.
            // This looks bad, so make them stop backing up within 130 pixels of the edge of the area.
            if ((actor.heading[0] > 0 && actor.x > 130) || (actor.heading[0] < 0 && actor.x < actor.area.width - 130)) {
                speedBonus *= -.1;
            } else speedBonus *= 0;
        } else if (distanceToTarget <= skillRange * 32) {
            speedBonus = 0;
        }
    }
    var currentX = actor.x;
    var currentZ = actor.z;
    var collision = false;
    var originalHeading = actor.heading.slice();
    var tryingVertical = false;
    var clockwiseFailed = false;
    var blockedByEnemy = null;
    var blockedByAlly = null;
    while (true) {
        actor.x = currentX + speedBonus * actor.speed * actor.heading[0] * Math.max(MIN_SLOW, 1 - actor.slow) * delta;
        actor.z = currentZ + speedBonus * actor.speed * actor.heading[2] * Math.max(MIN_SLOW, 1 - actor.slow) * delta;
        if (isNaN(actor.x) || isNaN(actor.z)) {
            debugger;
        }
        // Actor is not allowed to leave the path.
        actor.z = limitZ(actor.z, actor.width / 2);
        if (area.leftWall) actor.x = Math.max(ifdefor(area.left, 0) + 25 + actor.width / 2 + actor.z / 6, actor.x);
        else actor.x = Math.max(ifdefor(area.left, 0) + actor.width / 2, actor.x);
        if (area.rightWall) actor.x = Math.min(area.width - 25 - actor.width / 2 - actor.z / 6, actor.x);
        else actor.x = Math.min(area.width - actor.width / 2, actor.x);
        var collision = false;
        // Ignore ally collision during charge effects.
        if (!actor.chargeEffect) {
            for (var ally of actor.allies) {
                if (!ally.isDead && actor !== ally && getDistanceOverlap(actor, ally) <= -16 && new Vector([speedBonus * actor.heading[0], speedBonus * actor.heading[2]]).dotProduct(new Vector([ally.x - actor.x, ally.z - actor.z])) > 0) {
                    collision = true;
                    blockedByAlly = ally;
                    break;
                }
            }
        }
        if (!collision) {
            for (var object of area.objects) {
                if (object.solid === false) continue;
                var distance = getDistanceOverlap(actor, object);
                if (distance <= -8 && new Vector([(actor.x - currentX), (actor.z - currentZ)]).dotProduct(new Vector([object.x - currentX, object.z - currentZ])) > 0) {
                    collision = true;
                    break;
                }
            }
        }
        if (!collision) {
            for (var enemy of actor.enemies) {
                if (enemy.isDead || actor === enemy) continue;
                var distance = getDistanceOverlap(actor, enemy);
                if (distance <= 0 && actor.chargeEffect) {
                    finishChargeEffect(actor, enemy);
                    // Although this is a collision, don't mark it as one so that the move will complete.
                    collision = false;
                    break;
                }
                if (distance <= -16 && new Vector([speedBonus * actor.heading[0], speedBonus * actor.heading[2]]).dotProduct(new Vector([enemy.x - actor.x, enemy.z - actor.z])) > 0) {
                    collision = true;
                    blockedByEnemy = enemy;
                    break;
                }
            }
            if (actor.chargeEffect && getDistanceOverlap(actor, actor.chargeEffect.target) <= 0) {
                finishChargeEffect(actor, actor.chargeEffect.target);
            }
        }
        if (!collision) {
            break;
        }
        //console.log(JSON.stringify(['old', actor.heading]));
        var oldXHeading = actor.heading[0];
        if (clockwiseFailed) {
            actor.heading[0] = oldXHeading * rotationA + actor.heading[2] * rotationB;
            actor.heading[2] = actor.heading[2] * rotationA - oldXHeading * rotationB;
        } else {
            // rotationB is Math.sin(Math.PI / 20), so Math.sin(-Math.PI / 20) is -rotationB.
            actor.heading[0] = oldXHeading * rotationA - actor.heading[2] * rotationB;
            actor.heading[2] = actor.heading[2] * rotationA + oldXHeading * rotationB;
        }
        if (originalHeading[0] * actor.heading[0] + originalHeading[2] * actor.heading[2] < .01) {
            if (clockwiseFailed) {
                actor.x = currentX;
                actor.z = currentZ;
                actor.heading = originalHeading.slice();
                if (actor.activity) {
                    // If there is at least 1 enemy blocking the way, attack it
                    if (blockedByEnemy) setActorAttackTarget(actor, blockedByEnemy);
                    // If the way is only blocked by objects (non-enemies/non-allies), give up on the current action as those obstacles won't disappear or move.
                    else if (!blockedByAlly) actor.activity = null;
                }
                break;
            }
            clockwiseFailed = true;
            actor.heading = originalHeading.slice();
        }
        actor.x = currentX;
        actor.z = currentZ;
    }
    // If the actor hit something, complete the charge effect. The splash may still hit enemies,
    // and if it had an animation, it should play.
    if (collision && actor.chargeEffect) {
        finishChargeEffect(actor, null);
    }
}

function finishChargeEffect(actor, target) {
    var attackStats = createAttackStats(actor, actor.chargeEffect.chargeSkill, target);
    attackStats.distance = actor.chargeEffect.distance;
    var hitTargets = getAllInRange(target ? target.x : actor.x, actor.chargeEffect.chargeSkill.area, actor.enemies);
    for (var hitTarget of hitTargets) {
        applyAttackToTarget(attackStats, hitTarget);
    }
    actor.chargeEffect = null;
}

