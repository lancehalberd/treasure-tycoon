
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
                self.attackStats.effectiveness = 1 - currentRadius / radius * self.attackStats.attack.areaCoefficient;
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
            character.context.globalAlpha = alpha;
            character.context.fillStyle = color;
            character.context.beginPath();
            character.context.save();
            character.context.translate((self.x - character.cameraX), self.y);
            character.context.scale(1, height / currentRadius);
            character.context.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            character.context.fill();
            character.context.restore();
            character.context.globalAlpha = 1;
        }
    };
    return self;
}


function fieldEffect(attackStats, followTarget) {
    var color = ifdefor(attackStats.attack.base.color, 'red');
    var alpha = ifdefor(attackStats.attack.base.alpha, .5);
    var frames = ifdefor(attackStats.attack.base.frames, 10);
    if (!attackStats.attack.area) {
        throw new Error('Explosion effect called with no area set.');
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
            console.log("lightning strike!");
            applyAttackToTarget(attackStats, Random.element(targets));
        },
        'draw': function (character) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            character.context.globalAlpha = alpha;
            character.context.fillStyle = color;
            character.context.beginPath();
            character.context.save();
            character.context.translate((followTarget.x - character.cameraX), 40);
            character.context.scale(1, height / currentRadius);
            character.context.arc(0, 0, currentRadius, 0, 2 * Math.PI);
            character.context.fill();
            character.context.restore();
            character.context.globalAlpha = 1;
        }
    };
    return self;
}

function projectile(attackStats, x, y, vx, vy, target, delay, color, size) {
    size = ifdefor(size, 10);
    var self = {
        'x': x, 'y': y, 'vx': vx, 'vy': vy, 't': 0, 'done': false, 'delay': delay,
        'hit': false, 'target': target, 'attackStats': attackStats,
        'update': function (character) {
            // Put an absolute cap on how far a projectile can travel
            if (self.y > 240 - 64 || self.attackStats.distance > 2000) self.done = true;
            if (self.done || self.delay-- > 0) return
            self.x += self.vx;
            self.y += self.vy;
            self.vy+= .1 * 15 / Math.abs(self.vx);
            self.t += 1;
            // Don't do any collision detection once the projectile is spent.
            if (self.hit) return;
            self.attackStats.distance += Math.sqrt(self.vx * self.vx + self.vy * self.vy);
            if (Math.abs(self.target.x + 32 - self.x) < 10 && self.target.health > 0) {
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
                            self.attackStats.accuracy *= .95;
                            break;
                        }
                    }
                }
            } else if (self.target.health > 0 && self.vx * (self.target.x + 32 - self.x) <= 0) {
                self.vx = -self.vx;
            }
        },
        'draw': function (character) {
            if (self.done || self.delay > 0) return
            if (self.attackStats.attack.base.animation && projectileAnimations[self.attackStats.attack.base.animation]) {
                var animation = projectileAnimations[self.attackStats.attack.base.animation];
                var frame = animation.frames[Math.floor(self.t / 5) % animation.frames.length];
                character.context.drawImage(animation.image, frame[0], frame[1], frame[2], frame[3],
                                  self.x - character.cameraX - size / 2, self.y - size / 2, size, size);
            } else {
                character.context.fillStyle = ifdefor(color, '#000');
                character.context.fillRect(self.x - character.cameraX - size / 2, self.y - size / 2, size, size);
            }
        }
    };
    self.attackStats.projectile = self;
    return self;
}