
function explosionEffect(attackStats, x, y) {
    var color = ifdefor(attackStats.attack.color, 'red');
    var alpha = ifdefor(attackStats.attack.alpha, .5);
    if (!alpha) {
        alpha = .5;
    }
    var frames = ifdefor(attackStats.attack.frames, 10);
    if (!frames) {
        frames = 10;
    }
    if (!attackStats.attack.area) {
        throw new Error('Explosion effect called with no area set.');
    }
    var radius = attackStats.attack.area * ifdefor(attackStats.effectivness, 1) * 32;
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
            character.context.arc(self.x - character.cameraX, self.y, currentRadius, 0, 2 * Math.PI);
            character.context.fill();
            character.context.globalAlpha = 1;
        }
    };
    return self;
}