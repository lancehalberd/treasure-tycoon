
function songEffect(attackStats) {
    var color = ifdefor(attackStats.attack.base.color, 'red');
    var alpha = ifdefor(attackStats.attack.base.alpha, .5);
    var frames = ifdefor(attackStats.attack.base.frames, 10);
    if (!attackStats.attack.area) {
        throw new Error('Song effect called with no area set.');
    }
    var radius = attackStats.attack.area * ifdefor(attackStats.effectivness, 1) * 32;
    var endTime = attackStats.source.time + attackStats.attack.duration;
    var followTarget = attackStats.source;
    var height = ifdefor(attackStats.attack.base.height, 60);
    var yOffset = getAttackY(attackStats.source) + ifdefor(attackStats.attack.base.yOffset, 0);
    // This list is kept up to date each frame and targets stats are updated as they
    // are added/removed from this list.
    var effectedTargets = [];
    var self = {
        'attackStats': attackStats, 'currentFrame': 0, 'done': false,
        'x': followTarget.x,
        'y': followTarget.y,
        'z': followTarget.z,
        'width': 0,
        'height': 0,
        'update': function (area) {
            self.currentFrame++;
            self.x = followTarget.x;
            self.y = followTarget.y;
            if (followTarget.time > endTime || attackStats.source.isDead) {
                self.done = true;
                while (effectedTargets.length) removeEffectFromActor(effectedTargets.pop(), self.attackStats.attack.buff, true);
                return;
            }
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            var oldTargets = effectedTargets;
            var currentTargets = [];
            for (var i = 0; i < self.attackStats.source.allies.length; i++) {
                var target = self.attackStats.source.allies[i];
                // distance is 1d right now, maybe we should change that?
                var distance = getDistance(self, target);
                if (distance > currentRadius) continue;
                currentTargets.push(target);
                var oldIndex = oldTargets.indexOf(target);
                if (oldIndex >= 0) {
                    // Remove this from the set of old targets, since it is still being
                    // targeted. Below we remove the effect from old targets that
                    // are no longer being targeted.
                    oldTargets.splice(oldIndex, 1);
                } else {
                    addEffectToActor(target, self.attackStats.attack.buff, true);
                }
            }
            while (oldTargets.length) removeEffectFromActor(oldTargets.pop(), self.attackStats.attack.buff, true);

            effectedTargets = currentTargets;
        },
        'draw': function (area) {
            if (self.done) return;
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.save();
            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = color;
            mainContext.beginPath();
            mainContext.translate((followTarget.x - area.cameraX), groundY - yOffset);
            mainContext.scale(1, height / currentRadius);
            mainContext.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            mainContext.fill();
            mainContext.restore();
        }
    };
    return self;
}

function explosionEffect(attackStats, x, y, z) {
    var attack = attackStats.imprintedSpell || attackStats.attack;
    var color = ifdefor(attack.base.color, 'red');
    var alpha = ifdefor(attack.base.alpha, .5);
    var frames = ifdefor(attack.base.frames, 10);
    if (!attack.area) {
        throw new Error('Explosion effect called with no area set.');
    }
    var radius = attack.area * ifdefor(attackStats.effectiveness, 1) * 32;
    var height = radius * 2;
    if (attack.base.height) {
        height = attack.base.height;
    }
    if (attack.base.heightRatio) {
        height = radius * 2 * attack.base.heightRatio;
    }
    var self = {
        'hitTargets': [], 'attack': attack, 'attackStats': attackStats, 'x': x, 'y': y, 'z': z, 'width': 0, 'height': 0, 'currentFrame': 0, 'done': false,
        'update': function (area) {
            self.currentFrame++;
            if (self.currentFrame > frames + 5) {
                self.done = true;
            } else {
                var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
                self.width = currentRadius * 2;
                self.height = height * currentRadius / radius;
                self.height = self.width * currentRadius / radius;
                // areaCoefficient is the amount of effectiveness lost at the very edge of the radius.
                // areaCoefficient = 0 means the blast is equally effective everywhere.
                // areaCoefficient = 1 means the blast has no effect at the edge.
                // areaCoefficient < 0 means the blast has increased effect the further it is from the center.
                self.attackStats.effectiveness = 1 - currentRadius / radius * ifdefor(self.attack.areaCoefficient, 1);
                for (var i = 0; i < self.attackStats.source.enemies.length; i++) {
                    var target = self.attackStats.source.enemies[i];
                    if (target.isDead || self.hitTargets.indexOf(target) >= 0) continue;
                    var distance = getDistance(self, target);
                    if (distance > 0) continue;
                    applyAttackToTarget(attackStats, target);
                    // console.log("Hit with effectiveness " + attackStats.effectiveness);
                    self.hitTargets.push(target);
                }
            }
        },
        'draw': function (area) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = color;
            mainContext.beginPath();
            mainContext.save();
            mainContext.translate((self.x - area.cameraX), groundY - self.y - self.z / 2);
            mainContext.scale(1, height / (2 * radius));
            mainContext.arc(0, 0, currentRadius, ifdefor(self.attack.base.minTheta, 0), ifdefor(self.attack.base.maxTheta, 2 * Math.PI));
            mainContext.fill();
            mainContext.restore();
            mainContext.globalAlpha = 1;
        }
    };
    return self;
}

function fieldEffect(attackStats, followTarget) {
    var attack = attackStats.imprintedSpell || attackStats.attack;
    var color = ifdefor(attack.base.color, 'red');
    var alpha = ifdefor(attack.base.alpha, .5);
    var frames = ifdefor(attack.base.frames, 10);
    if (!attack.area) {
        throw new Error('Field effect called with no area set.');
    }
    var radius = attack.area * ifdefor(attackStats.effectivness, 1) * 32;
    var height = ifdefor(attack.base.height, radius * 2);
    var endTime = attackStats.source.time + attack.duration;
    var nextHit = attackStats.source.time + 1 / attack.hitsPerSecond;
    var yOffset = getAttackY(attackStats.source) + ifdefor(attack.base.yOffset, 0);
    var self = {
        'attackStats': attackStats,
        'x': followTarget.x,
        'y': followTarget.y,
        'z': followTarget.z,
        'width': radius * 2, 'height': height,
        'currentFrame': 0, 'done': false,
        'update': function (area) {
            self.currentFrame++;
            if (self.attackStats.source.time > endTime || attackStats.source.isDead) {
                self.done = true;
                return;
            }
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            self.width = currentRadius * 2;
            self.x = followTarget.x;
            self.y = followTarget.y;
            self.height = height * currentRadius / radius;
            if (self.attackStats.source.time < nextHit) {
                return;
            }
            nextHit += 1 / attack.hitsPerSecond;

            var targets = [];
            for (var i = 0; i < self.attackStats.source.enemies.length; i++) {
                var target = self.attackStats.source.enemies[i];
                var distance = getDistance(self, target);
                if (distance > 0) continue;
                targets.push(target);
            }
            if (!targets.length) {
                return;
            }
            applyAttackToTarget(attackStats, Random.element(targets));
        },
        'draw': function (area) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = color;
            mainContext.beginPath();
            mainContext.save();
            mainContext.translate((followTarget.x - area.cameraX), groundY - yOffset);
            mainContext.scale(1, height / (2 * currentRadius));
            mainContext.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            mainContext.fill();
            mainContext.restore();
            mainContext.globalAlpha = 1;
        }
    };
    return self;
}

function projectile(attackStats, x, y, z, vx, vy, vz, target, delay, color, size) {
    size = ifdefor(size, 10);
    if (!size) {
        pause();
        console.log(attackStats);
        debugger;
        throw new Error('Projectile found withou size');
    }
    var self = {
        'distance': 0, 'x': x, 'y': y, 'z': z, 'vx': vx, 'vy': vy, 'vz': vz, 't': 0, 'done': false, 'delay': delay,
        'width': size, 'height': size,
        'hit': false, 'target': target, 'attackStats': attackStats, 'hitTargets': [],
        'update': function (area) {
            // Put an absolute cap on how far a projectile can travel
            if (self.y < 0 || self.distance > 2000) {
                applyAttackToTarget(self.attackStats, {'x': self.x, 'y': self.y, 'z': self.z, 'width': 0, 'height': 0});
                self.done = true;
            }
            if (self.done || self.delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.z += self.vz;
            self.distance += Math.sqrt(self.vx * self.vx + self.vy * self.vy + self.vz * self.vz);
            // attack stats may be shared between multiple projectiles.
            // this isn't ideal but it is probably okay to just copy local value here.
            self.attackStats.distance = self.distance;
            var hit = false;
            if (attackStats.attack.tags['rain'] >= 0) {
                // rain hits when it touches the ground
                if (self.y <= 0) {
                    self.y = 0;
                    applyAttackToTarget(self.attackStats, null);
                    self.hit = true;
                    self.done = true;
                }
            } else {
                // normal projectiles hit when they overlap the target.
                hit = (getDistance(self, self.target) <= 0) && (!self.target.isActor || self.target.health > 0);
            }
            self.vy -= attackStats.gravity;
            self.t += 1;
            if (self.attackStats.piercing) {
                for (var i = 0; i < self.attackStats.source.enemies.length; i++) {
                    var enemy = self.attackStats.source.enemies[i];
                    if (enemy === self.target || self.hitTargets.indexOf(enemy) >= 0) {
                        continue;
                    }
                    if (getDistance(self, enemy) && enemy.health > 0) {
                        applyAttackToTarget(self.attackStats, enemy);
                        self.hitTargets.push(enemy);
                    }
                }
            }
            // Don't do any collision detection once the projectile is spent.
            if (self.hit) return;
            if (hit) {
                self.hit = true;
                // Juggler can bounce attacks back to himself with friendly set to true to allow him to bounce
                // attacks back to himself without injuring himself.
                if (!ifdefor(attackStats.friendly) && ifdefor(self.target.reflectBarrier, 0) > 0) {
                    // Allow reflect barrier to become negative so that it can take time to restore after being hit by a much more powerful attack.
                    self.target.reflectBarrier = self.target.reflectBarrier - self.attackStats.magicDamage - self.attackStats.damage;
                    self.hit = false;
                    var newTarget = self.attackStats.source;
                    self.attackStats.source = self.target;
                    self.target = newTarget;
                    var v = getProjectileVelocity(self.attackStats, self.x, self.y, self.z, newTarget);
                    self.vx = v[0];
                    self.vy = v[1];
                    self.vz = v[2];
                } else if (ifdefor(attackStats.friendly) || applyAttackToTarget(self.attackStats, self.target)) {
                    attackStats.friendly = false;
                    self.done = true;
                    if (ifdefor(attackStats.attack.chaining)) {
                        self.done = false;
                        // every bounce allows piercing projectiles to hit each target again.
                        self.hitTargets = [];
                        // reduce the speed. This seems realistic and make it easier to
                        // distinguish bounced attacks from new attacks.
                        self.vx = -self.vx / 2;
                        self.vz = -self.vz / 2;
                        var targets = self.attackStats.source.enemies.slice();
                        targets.push(attackStats.source);
                        while (targets.length) {
                            var index = Math.floor(Math.random() * targets.length);
                            var newTarget = targets[index];
                            if (newTarget.health <= 0 || newTarget === self.target || newTarget.cloaked
                                || getDistance(self.target, newTarget) > self.attackStats.attack.range * 32
                            ) {
                                targets.splice(index--, 1);
                                continue;
                            }
                            self.hit = false;
                            self.target = newTarget;
                            if (newTarget === attackStats.source) {
                                attackStats.friendly = true;
                            }
                            // Calculate new velocity
                            var v = getProjectileVelocity(self.attackStats, self.x, self.y, self.z, newTarget);
                            self.vx = v[0];
                            self.vy = v[1];
                            self.vz = v[2];
                            break;
                        }
                    } else if (ifdefor(self.attackStats.piercing)) {
                        self.done = false;
                        //console.log('pierce');
                    }
                }
            }
        },
        'draw': function (area) {
            if (self.done || self.delay > 0) return
            mainContext.save();
            mainContext.translate(self.x - area.cameraX, groundY - self.y - self.z / 2);
            if (self.vx < 0) {
                mainContext.scale(-1, 1);
                mainContext.rotate(-Math.atan2(self.vy, -self.vx));
            } else {
                mainContext.rotate(-Math.atan2(self.vy, self.vx));
            }
            if (self.attackStats.animation) {
                var animation = self.attackStats.animation;
                var frame = animation.frames[Math.floor(ifdefor(animation.fps, 10) * self.t * 20 / 1000) % animation.frames.length];
                mainContext.drawImage(animation.image, frame[0], frame[1], frame[2], frame[3],
                                   -size / 2, -size / 2, size, size);
            } else {
                mainContext.fillStyle = ifdefor(color, '#000');
                mainContext.fillRect(-size / 2, -size / 2, size, size);
            }
            mainContext.restore();
        }
    };
    self.attackStats.projectile = self;
    return self;
}

function getProjectileVelocity(attackStats, x, y, z, target) {
    var scale = ifdefor(target.scale, 1);
    var ty = ifdefor(target.y, 0) + ifdefor(target.height, 128) * 3 / 4;
    var v = [target.x - x, ty - y, target.z - z];
    var distance = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    var frameEstimate = distance / attackStats.speed;
    // Over a period of N frames, the projectile will fall roughly N^2 / 2, update target velocity accordingly
    v[1] += attackStats.gravity * frameEstimate * frameEstimate / 2;
    distance = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (distance === 0 || isNaN(distance) || isNaN(v[0]) || isNaN(v[1])) {
        console.log("invalid velocity");
        console.log([attackStats.speed, attackStats.gravity]);
        console.log([x, y, z, target.x, ty, target.z]);
        console.log([target.x, target.y, target.width, target.height]);
        console.log(target);
        console.log(distance);
        console.log(v);
        pause();
        debugger;
    }
    return [v[0] * attackStats.speed / distance, v[1] * attackStats.speed / distance, v[2] * attackStats.speed / distance];
}


function expireTimedEffects(actor) {
    if (actor.isDead ) return;
    var changed = false;
    for (var i = 0; i < actor.allEffects.length; i++) {
        var effect = actor.allEffects[i];
        if (effect.expirationTime && effect.expirationTime < actor.time) {
            actor.allEffects.splice(i, 1);
            removeBonusSourceFromObject(actor, effect, false);
            changed = true;
        }
    }
    if (changed) recomputeDirtyStats(actor);
}
function addTimedEffect(actor, effect, area) {
    if (actor.isDead) return;
    area = ifdefor(area, ifdefor(effect.area));
    // Copy the effect because each timed effect has a distinct expirationTime.
    // Also setting the area here to 0 allows us to call this method again for
    // allies within the area of effect without recursing infinitely.
    effect = {
        'base': effect.base,
        'bonuses': effect.bonuses,
        'duration': effect.duration,
        'maxStacks': effect.maxStacks ? effect.maxStacks : 50
    };
    if (area) {
        actor.allies.forEach(function (ally) {
            if (ally === actor) return;
            if (getDistance(actor, ally) < area * 32) addTimedEffect(ally, effect, 0);
        });
    }
    if (effect.duration !== 'forever') effect.expirationTime = actor.time + effect.duration;
    var count = 0;
    ifdefor(actor.allEffects, []).forEach(function (currentEffect) {
        if (currentEffect.base === effect.base) count++;
    });
    if (count < effect.maxStacks) {
        addEffectToActor(actor, effect, true);
    }
}
function addEffectToActor(actor, effect, triggerComputation) {
    actor.allEffects.push(effect);
    addBonusSourceToObject(actor, effect, triggerComputation);
}
function removeEffectFromActor(actor, effect, triggerComputation) {
    var index = actor.allEffects.indexOf(effect);
    if (index >= 0) actor.allEffects.splice(index, 1);
    removeBonusSourceFromObject(actor, effect, triggerComputation);
}