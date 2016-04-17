
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