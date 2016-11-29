
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
    var yOffset = ifdefor(attackStats.attack.base.yOffset, 120);
    // This list is kept up to date each frame and targets stats are updated as they
    // are added/removed from this list.
    var effectedTargets = [];
    var self = {
        'attackStats': attackStats, 'currentFrame': 0, 'done': false,
        'update': function (character) {
            self.currentFrame++;
            if (followTarget.time > endTime) {
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
                var distance = Math.max(0,  (followTarget.x > target.x) ? (followTarget.x - target.x - target.width) : (target.x - followTarget.x));
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
        'draw': function (character) {
            if (self.done) return;
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.save();
            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = color;
            mainContext.beginPath();
            mainContext.translate((followTarget.x - character.cameraX), yOffset);
            mainContext.scale(1, height / currentRadius);
            mainContext.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            mainContext.fill();
            mainContext.restore();
        }
    };
    return self;
}

function explosionEffect(attackStats, x, y) {
    var color = ifdefor(attackStats.attack.base.color, 'red');
    var alpha = ifdefor(attackStats.attack.base.alpha, .5);
    var frames = ifdefor(attackStats.attack.base.frames, 10);
    if (!attackStats.attack.area) {
        throw new Error('Explosion effect called with no area set.');
    }
    var radius = attackStats.attack.area * ifdefor(attackStats.effectivness, 1) * 32;
    var height = ifdefor(attackStats.attack.base.height, radius);
    var self = {
        'hitTargets': [], 'attackStats': attackStats, 'x': x, 'y': y, 'currentFrame': 0, 'done': false,
        'update': function (character) {
            self.currentFrame++;
            if (self.currentFrame > frames + 5) {
                self.done = true;
            } else {
                var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
                // areaCoefficient is the amount of effectiveness lost at the very edge of the radius.
                // areaCoefficient = 0 means the blast is equally effective everywhere.
                // areaCoefficient = 1 means the blast has no effect at the edge.
                // areaCoefficient < 0 means the blast has increased effect the further it is from the center.
                self.attackStats.effectiveness = 1 - currentRadius / radius * ifdefor(self.attackStats.attack.areaCoefficient, 1);
                for (var i = 0; i < self.attackStats.source.enemies.length; i++) {
                    var target = self.attackStats.source.enemies[i];
                    if (self.hitTargets.indexOf(target) >= 0) continue;
                    // distance is 1d right now, maybe we should change that?
                    var distance = Math.max(0,  (self.x > target.x) ? (self.x - target.x - target.width) : (target.x - self.x));
                    if (distance > currentRadius) continue;
                    applyAttackToTarget(attackStats, target);
                    // console.log("Hit with effectiveness " + attackStats.effectiveness);
                    self.hitTargets.push(target);
                }
            }
        },
        'draw': function (character) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = color;
            mainContext.beginPath();
            mainContext.save();
            mainContext.translate((self.x - character.cameraX), self.y);
            mainContext.scale(1, height / currentRadius);
            mainContext.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            mainContext.fill();
            mainContext.restore();
            mainContext.globalAlpha = 1;
        }
    };
    return self;
}

function fieldEffect(attackStats, followTarget) {
    var color = ifdefor(attackStats.attack.base.color, 'red');
    var alpha = ifdefor(attackStats.attack.base.alpha, .5);
    var frames = ifdefor(attackStats.attack.base.frames, 10);
    if (!attackStats.attack.area) {
        throw new Error('Field effect called with no area set.');
    }
    var radius = attackStats.attack.area * ifdefor(attackStats.effectivness, 1) * 32;
    var height = ifdefor(attackStats.attack.base.height, radius);
    var endTime = attackStats.source.time + attackStats.attack.duration;
    var nextHit = attackStats.source.time + 1 / attackStats.attack.hitsPerSecond;
    var self = {
        'attackStats': attackStats, 'currentFrame': 0, 'done': false,
        'update': function (character) {
            self.currentFrame++;
            if (self.attackStats.source.time > endTime) {
                self.done = true;
                return;
            }
            if (self.attackStats.source.time < nextHit) {
                return;
            }
            nextHit += 1 / attackStats.attack.hitsPerSecond;

            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            var targets = [];
            for (var i = 0; i < self.attackStats.source.enemies.length; i++) {
                var target = self.attackStats.source.enemies[i];
                // distance is 1d right now, maybe we should change that?
                var distance = Math.max(0,  (followTarget.x > target.x) ? (followTarget.x - target.x - target.width) : (target.x - followTarget.x));
                if (distance > currentRadius) continue;
                targets.push(target);
            }
            if (!targets.length) {
                return;
            }
            applyAttackToTarget(attackStats, Random.element(targets));
        },
        'draw': function (character) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = color;
            mainContext.beginPath();
            mainContext.save();
            mainContext.translate((followTarget.x - character.cameraX), 40);
            mainContext.scale(1, height / currentRadius);
            mainContext.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            mainContext.fill();
            mainContext.restore();
            mainContext.globalAlpha = 1;
        }
    };
    return self;
}

function projectile(attackStats, x, y, vx, vy, target, delay, color, size) {
    size = ifdefor(size, 10);
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'hit': false, 'target': target, 'attackStats': attackStats, 'hitTargets': [],
        'update': function (character) {
            // Put an absolute cap on how far a projectile can travel
            if (self.y > 240 - 64 || self.attackStats.distance > 2000) self.done = true;
            if (self.done || self.delay-- > 0) return
            var tx = self.target.x + ifdefor(self.target.width, 64) / 2;
            var ty = ifdefor(self.target.y, 64) + ifdefor(self.target.height, 128) / 2;
            self.x += self.vx;
            self.y += self.vy;
            var hit = false;
            if (attackStats.attack.tags['rain'] >= 0) {
                var speed = Math.sqrt(self.vx * self.vx + self.vy * self.vy);
                self.vx = tx - self.x;
                self.vy = Math.max(self.vy, ty - self.y);
                var distance = Math.sqrt(self.vx * self.vx + self.vy * self.vy);
                self.vx *= speed / distance;
                self.vy *= speed / distance;
                self.vy += 1;
                // rain hits when it touches the ground
                hit = self.y >= (240 - 96);
            } else {
                self.vy += .1 * 15 / Math.abs(self.vx);
                // normal projectiles hit when they get close to the targets center.
                hit = Math.abs(tx - self.x) < 10 && Math.abs(ty - self.y) < 64 && self.target.health > 0;
            }
            self.t += 1;
            if (self.attackStats.piercing) {
                for (var i = 0; i < self.attackStats.source.enemies.length; i++) {
                    var enemy = self.attackStats.source.enemies[i];
                    if (enemy === self.target || self.hitTargets.indexOf(enemy) >= 0) {
                        continue;
                    }
                    if (Math.abs(enemy.x + ifdefor(enemy.width, 64) / 2 - self.x) < 10 && Math.abs(ifdefor(enemy.y, 64) + ifdefor(enemy.height, 128) / 2 - self.y) < 64 && enemy.health > 0) {
                        applyAttackToTarget(self.attackStats, enemy);
                        self.hitTargets.push(enemy);
                    }
                }
            }
            // Don't do any collision detection once the projectile is spent.
            if (self.hit) return;
            self.attackStats.distance += Math.sqrt(self.vx * self.vx + self.vy * self.vy);
            if (hit) {
                self.hit = true;
                if (ifdefor(self.target.reflectBarrier, 0)) {
                    self.target.reflectBarrier = Math.max(0, self.target.reflectBarrier - self.attackStats.magicDamage - self.attackStats.damage);
                    self.hit = false;
                    var newTarget = self.attackStats.source;
                    self.attackStats.source = self.target;
                    self.target = newTarget;
                    self.vx = -self.vx;
                    var distance = Math.abs(self.x - newTarget.x);
                    if (self.y > 240 - 128) self.vy = -distance / 200;
                } else if (applyAttackToTarget(self.attackStats, self.target)) {
                    self.done = true;
                    if (ifdefor(attackStats.attack.chaining)) {
                        self.done = false;
                        // every bounce allows piercing projectiles to hit each target again.
                        self.hitTargets = [];
                        // reduce the speed. This seems realistic and make it easier to
                        // distinguish bounced attacks from new attacks.
                        self.vx = -self.vx / 5;
                        var targets = self.attackStats.source.enemies.slice();
                        while (targets.length) {
                            var index = Math.floor(Math.random() * targets.length);
                            var newTarget = targets[index];
                            if (newTarget.health <= 0 || newTarget === self.target || newTarget.cloaked
                                || getDistance(self.target, newTarget) > self.attackStats.attack.range * 32
                            ) {
                                targets.splice(index--, 1);
                                continue;
                            }
                            // increase the speed back to normal if the ricochete succeeds.
                            self.vx *= 5;
                            self.hit = false;
                            self.target = newTarget;
                            var distance = Math.abs(self.x - newTarget.x);
                            if (self.vx * (self.target.x + 32 - self.x) <= 0) {
                                self.vx = -self.vx;
                            }
                            if (self.y > 240 - 128) self.vy = -distance / 200;
                            break;
                        }
                    } else if (ifdefor(self.attackStats.piercing)) {
                        self.done = false;
                        console.log('pierce');
                    }
                }
            } else if (self.target.health > 0 && self.vx * (tx - self.x) <= 0) {
                self.vx = -self.vx;
            }
        },
        'draw': function (character) {
            if (self.done || self.delay > 0) return
            if (self.attackStats.attack.base.animation && projectileAnimations[self.attackStats.attack.base.animation]) {
                var animation = projectileAnimations[self.attackStats.attack.base.animation];
                var frame = animation.frames[Math.floor(self.t / 5) % animation.frames.length];
                mainContext.drawImage(animation.image, frame[0], frame[1], frame[2], frame[3],
                                  self.x - character.cameraX - size / 2, self.y - size / 2, size, size);
            } else {
                mainContext.fillStyle = ifdefor(color, '#000');
                mainContext.fillRect(self.x - character.cameraX - size / 2, self.y - size / 2, size, size);
            }
        }
    };
    self.attackStats.projectile = self;
    return self;
}


function expireTimedEffects(character, actor) {
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
function addTimedEffect(actor, effect) {
    if (actor.isDead ) return;
    var area = ifdefor(effect.area);
    // Copy the effect because each timed effect has a distinct expirationTime.
    // Also setting the area here to 0 allows us to call this method again for
    // allies within the area of effect without recursing infinitely.
    effect = {
        'base': effect.base,
        'bonuses': effect.bonuses,
        'duration': effect.duration,
        'area': 0
    };
    if (area) {
        actor.allies.forEach(function (ally) {
            if (ally === actor) return;
            if (getDistance(actor, ally) < area * 32) addTimedEffect(ally, effect);
        });
    }
    // effects without duration last indefinitely.
    if (effect.duration) effect.expirationTime = actor.time + effect.duration;
    addEffectToActor(actor, effect, true);
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