
function explosionEffect(x, y, radius, frames, color, alpha, vx, vy) {
    var self = {
        'x': x, 'y': y, 'vx': ifdefor(vx, 0), 'vy': ifdefor(vy, 0), 'currentFrame': 0, 'done': false,
        'update': function (character) {
            self.x += self.vx;
            self.y += self.vy;
            self.currentFrame++;
            if (self.currentFrame > frames + 5) {
                self.done = true;
            }
        },
        'draw': function (character) {
            if (self.done) return
            var currentRadius = Math.round(radius * Math.min(1, self.currentFrame / frames));
            character.context.globalAlpha = ifdefor(alpha, .5);
            character.context.fillStyle = ifdefor(color, '#000');
            character.context.beginPath();
            character.context.arc(self.x - character.cameraX, self.y, currentRadius, 0, 2 * Math.PI);
            character.context.fill();
            character.context.globalAlpha = 1;
        }
    };
    return self;
}