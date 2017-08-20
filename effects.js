
function songEffect(attackStats) {
    var color = ifdefor(attackStats.attack.base.color, 'red');
    var alpha = ifdefor(attackStats.attack.base.alpha, .3);
    var frames = ifdefor(attackStats.attack.base.frames, 30);
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
    var notes = [];
    var thetaOffset = Math.PI * Math.random();
    var effectedTargets = new Set();
    var self = {
        attackStats, 'currentFrame': 0, 'done': false,
        update(area) {
            self.currentFrame++;
            if (notes.length < 6) {
                var note = animationEffect(effectAnimations.song,
                    {x:0, y: 20, z: 0, width: 25, height: 50}, {loop: true, frameSpeed: .5, tintColor: color, tintValue: .5});
                area.effects.push(note);
                followTarget.boundEffects.push(note);
                notes.push(note);
            }
            if (followTarget.time > endTime || followTarget.isDead) {
                this.finish();
                return;
            }
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            var currentLocation = {x: followTarget.x, z: followTarget.z}; // We can't just use followTarget because we need width/height to be 0.
            for (var i = 0; i < notes.length; i++) {
                var note = notes[i];
                var timeTheta = thetaOffset + followTarget.time;
                var xRadius = Math.min(currentRadius, 300);
                var zRadius = Math.min(currentRadius, 90);
                note.target.x = currentLocation.x + Math.cos(i * 2 * Math.PI / 6 + timeTheta) * xRadius;
                note.target.z = currentLocation.z + Math.sin(i * 2 * Math.PI / 6 + timeTheta) * zRadius;
                note.target.y = 40 + 20 * Math.cos(i * Math.PI / 4 + 6 * timeTheta);
            }
            var currentTargets = new Set();
            for (target of self.attackStats.source.allies) {
                if (getDistance(currentLocation, target) > currentRadius) {
                    if (effectedTargets.has(target)) {
                        removeEffectFromActor(target, self.attackStats.attack.buff, true);
                        effectedTargets.delete(target);
                    }
                } else {
                    currentTargets.add(target);
                    if (!effectedTargets.has(target)) {
                        addEffectToActor(target, self.attackStats.attack.buff, true);
                        effectedTargets.add(target);
                    }
                }
            }
            // Remove any targets not currently found, for instance a target that was effected
            // before the owner moved to another area.
            for (var target of effectedTargets) {
                if (!currentTargets.has(target)) {
                    removeEffectFromActor(target, self.attackStats.attack.buff, true);
                    effectedTargets.delete(target);
                }
            }
        },
        drawGround(area) {
            drawOnGround(context => {
                var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
                drawGroundCircle(context, area, followTarget.x, followTarget.z, currentRadius)
                context.save();
                context.globalAlpha = alpha;
                context.fillStyle = color;
                context.fill();
                context.globalAlpha = .1;
                context.lineWidth = 8;
                context.strokeStyle = '#FFF';
                context.stroke();
                context.restore();
            });
        },
        finish() {
            effectedTargets.forEach(target => removeEffectFromActor(target, self.attackStats.attack.buff, true));
            effectedTargets = new Set();
            self.done = true;
            while (notes.length) notes.pop().done = true;
        }
    };
    return self;
}

// Used to play an animation that has no other effects, for example, the sparkles for the heal spell.
// Set target to a character to have an effect follow them, or to a static target to display in place.
function animationEffect(animation, target, {scale = [1, 1], loop = false, frameSpeed = 1, tintColor, tintValue}) {
    return {
        target, x: target.x, 'y': target.y, 'z': target.z, 'width': target.width * scale[0], 'height': target.height * scale[1], 'currentFrame': 0, 'done': false,
        update(area) {
            this.currentFrame+=frameSpeed;
            this.x = target.x;
            this.y = target.y;
            this.z = target.z - 1; //Show the effect in front of the target.
            this.width = target.width * scale[0];
            this.height = target.height * scale[1];
            if (!loop && this.currentFrame >= animation.frames.length) this.done = true;
        },
        draw(area) {
            if (this.done) return
            mainContext.save();
            // mainContext.globalAlpha = alpha;
            mainContext.translate((this.x - area.cameraX), groundY - this.y - this.z / 2 - target.height / 2);
            mainContext.fillStyle = 'red';
            // fillRectangle(mainContext, rectangle(-this.width / 2, -this.height / 2, this.width, this.height));
            var frame = animation.frames[Math.floor(this.currentFrame) % animation.frames.length];
            var sourceRectangle = rectangle(frame[0], frame[1], frame[2], frame[3]);
            var targetRectangle = rectangle(-this.width / 2, -this.height / 2, this.width, this.height);
            if (tintColor) {
                drawTintedImage(mainContext, animation.image, tintColor, ifdefor(tintValue, .5),
                    sourceRectangle, targetRectangle);
            } else {
                drawImage(mainContext, animation.image, sourceRectangle, targetRectangle);
            }
            mainContext.restore();
        }
    };
}

function explosionEffect(attackStats, x, y, z) {
    var attack = attackStats.imprintedSpell || attackStats.attack;
    var color = ifdefor(attack.base.color, 'red');
    var alpha = ifdefor(attack.base.alpha, .5);
    var animation, frames = attack.base.frames || 10, endFrames = attack.base.endFrames || 5;
    if (attack.base.explosionAnimation) {
        animation = attack.base.explosionAnimation;
        frames = animation.frames.length;
        if (animation.endFrames) endFrames = animation.endFrames.length;
        alpha = ifdefor(attack.base.alpha, 1);
    }
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
        'hitTargets': [], attack, attackStats, x, y, z, 'width': 0, 'height': 0, 'currentFrame': 0, 'done': false,
        update(area) {
            self.currentFrame++;
            if (self.currentFrame > frames) {
                if (self.currentFrame > frames + endFrames) self.done = true;
                return;
            }
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
        },
        draw(area) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.save();
            mainContext.globalAlpha = alpha;
            mainContext.translate((self.x - area.cameraX), groundY - self.y - self.z / 2);
            if (animation) {
                var frame = (self.currentFrame < frames || !animation.endFrames)
                    ? animation.frames[Math.min(frames - 1, self.currentFrame)]
                    : animation.endFrames[Math.min(endFrames - 1, self.currentFrame - frames)];
                var currentRadius = currentRadius * (animation.scale || 1)
                mainContext.drawImage(animation.image, frame[0], frame[1], frame[2], frame[3],
                                               -currentRadius, -currentRadius, currentRadius * 2, currentRadius * 2);
            } else {
                mainContext.beginPath();
                mainContext.scale(1, height / (2 * radius));
                mainContext.arc(0, 0, currentRadius, ifdefor(self.attack.base.minTheta, 0), ifdefor(self.attack.base.maxTheta, 2 * Math.PI));
                mainContext.fillStyle = color;
                mainContext.fill();
            }
            mainContext.restore();
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
        attackStats,
        'x': followTarget.x,
        'y': followTarget.y,
        'z': followTarget.z,
        'width': radius * 2, height,
        'currentFrame': 0, 'done': false,
        update(area) {
            self.currentFrame++;
            if (self.attackStats.source.time > endTime || attackStats.source.isDead) {
                self.done = true;
                return;
            }
            // followTarget.time gets changed when changing areas, so we need to correct the
            // next hit time when this happens. It is sufficent to just move it closer if the
            // current next hit time is too far in the future.
            nextHit = Math.min(followTarget.time + 1 / attack.hitsPerSecond, nextHit);
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            self.width = currentRadius * 2;
            self.x = followTarget.x;
            self.y = followTarget.y;
            self.z = followTarget.z;
            self.height = height * currentRadius / radius;
            if (followTarget.time < nextHit) {
                return;
            }
            nextHit += 1 / attack.hitsPerSecond;

            var livingTargets = followTarget.enemies.filter(target => !target.isDead);
            var livingTargetsInRange = livingTargets.filter(target => getDistance(self, target) <= 0);
            var healthyTargetsInRange = livingTargetsInRange.filter(target => !isActorDying(target));
            if (healthyTargetsInRange.length) {
                applyAttackToTarget(attackStats, Random.element(healthyTargetsInRange));
            } else if (livingTargetsInRange.length) {
                applyAttackToTarget(attackStats, Random.element(livingTargetsInRange));
            }
        },
        draw(area) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            mainContext.globalAlpha = alpha;
            mainContext.fillStyle = color;
            mainContext.beginPath();
            mainContext.save();
            mainContext.translate((followTarget.x - area.cameraX), groundY - yOffset - followTarget.z / 2);
            mainContext.scale(1, height / (2 * currentRadius));
            mainContext.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            mainContext.fill();
            mainContext.restore();
            mainContext.globalAlpha = 1;
        },
        drawGround(area) {
            drawOnGround(context => {
                var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
                drawGroundCircle(context, area, followTarget.x, followTarget.z, currentRadius)
                context.save();
                context.globalAlpha = alpha;
                context.fillStyle = color;
                context.fill();
                context.globalAlpha = .1;
                context.lineWidth = 8;
                context.strokeStyle = '#FFF';
                context.stroke();
                context.restore();
            });
        },
    };
    return self;
}
// These are fake projectiles created by a projectile to be displayed as blurred after images.
function afterImage({attackStats, x, y, z, vx, vy, vz, color, size, t} ) {
    var alpha = 1;
    return {
        update(area) {
            alpha -= 1 / ((attackStats.attack.base.afterImages || 3) + 1);
            if (alpha <= 0) this.done = true;
        },
        draw(area) {
            if (this.done || alpha >= 1) return;
            mainContext.save();
            mainContext.globalAlpha = alpha;
            mainContext.translate(x - area.cameraX, groundY - y - z / 2);
            if (vx < 0) {
                mainContext.scale(-1, 1);
                mainContext.rotate(-Math.atan2(vy, -vx));
            } else {
                mainContext.rotate(-Math.atan2(vy, vx));
            }
            var animation = attackStats.animation;
            if (animation) {
                var frame = animation.frames[Math.floor(ifdefor(animation.fps, 10) * t * 20 / 1000) % animation.frames.length];
                mainContext.drawImage(animation.image, frame[0], frame[1], frame[2], frame[3],
                                   -size / 2, -size / 2, size, size);
            } else {
                mainContext.fillStyle = ifdefor(color, '#000');
                mainContext.fillRect(-size / 2, -size / 2, size, size);
            }
            mainContext.restore();
        }
    };
}
function projectile(attackStats, x, y, z, vx, vy, vz, target, delay, color, size) {
    size = ifdefor(size, 10);
    if (!size) {
        pause();
        console.log(attackStats);
        debugger;
        throw new Error('Projectile found without size');
    }
    var stuckDelta, stuckTarget;
    var self = {
        'distance': 0, x, y, z, vx, vy, vz, size, 't': 0, 'done': false, delay,
        'width': size, 'height': size, color,
        'hit': false, target, attackStats, 'hitTargets': [],
        stickToTarget(target) {
            stuckTarget = target;
            stuckDelta = {x: self.x - self.vx - target.x, y: self.y - self.vy - target.y, z: self.z - self.vz - target.z};
        },
        update(area) {
            if (stuckDelta) {
                if (!stuckTarget.pull || stuckTarget.pull.sourceAttackStats !== attackStats) {
                    self.done = true;
                    return;
                }
                self.x = stuckTarget.x + stuckDelta.x;
                self.y = stuckTarget.y + stuckDelta.y;
                self.z = stuckTarget.z + stuckDelta.z;
            }
            // Put an absolute cap on how far a projectile can travel
            if (self.y < 0 || self.distance > 2000 && !stuckDelta) {
                applyAttackToTarget(self.attackStats, {'x': self.x, 'y': self.y, 'z': self.z, 'width': 0, 'height': 0});
                self.done = true;
            }
            if (self.done || self.delay-- > 0) return;
            if (attackStats.attack.base.afterImages > 0) {
                area.projectiles.push(new afterImage(this));
            }
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
                        self.hitTargets.push(enemy);
                        if (applyAttackToTarget(self.attackStats, enemy) && self.attackStats.attack.pullsTarget) {
                            self.stickToTarget(enemy);
                            return;
                        }
                    }
                }
            }
            // Don't do any collision detection once the projectile is spent.
            if (self.hit || !hit) return;
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
                // Friendly attack shouldn't hook the user, this is like when a juggler bounces a ball off of himself.
                if (!attackStats.friendly && self.attackStats.attack.pullsTarget) {
                    self.stickToTarget(self.target);
                    return;
                }
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
        },
        draw(area) {
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
    // One reason this might not be set is if an actor was removed from an area while an aoe buff was
    // still targeting it. In this case, the aoe buff will attempt to remove the out of range target
    // but the target has already had all effects removed from it.
    if (index >= 0) {
        actor.allEffects.splice(index, 1);
        removeBonusSourceFromObject(actor, effect, triggerComputation);
    } else {
        // This case definitely happens when an actor playing a song returns to the world map.
        // Returning to the world map removes all effects, but doesn't remove the actor from the list of effected
        // targets, then the song is removed and tries to remove the effect from the actor since it still has
        // them listed as effected.
        //debugger;
    }
}