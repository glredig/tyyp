function Bullet(target) {
  this.x = 0;
  this.y = 0;
  this.velocity = 7;
  this.vel_x;
  this.vel_y;
  this.theta;
  this.target = target;
  this.end_x;
  this.end_y;
}

Bullet.prototype = {
  
  init: function() {
    this.x = 0;
    this.y = TYYP.c_height;
    
    this.setEndPoint();
  },
  
  setEndPoint: function() {
    var a, b, c, disc, t1, t2, t;

    // Vector work to find bullet/target intercept point
    a = Math.pow(this.target.velocity, 2) - Math.pow(this.velocity, 2);
    b = 2 * (this.target.velocity * (this.target.y - this.y));
    c = Math.pow(this.target.x - this.x, 2) + Math.pow(this.target.y - this.y, 2);

    // Discriminant
    disc = b * b - 4 * a * c;
    
    // Possible solutions to the quadratic
    var t1 = (-b + Math.pow(disc, .5)) / (2 * a);
    var t2 = (-b - Math.pow(disc, .5)) / (2 * a);
    
    var t = [];
    
    // Only non-negative values matter
    if (t1 > 0) t.push(t1); 
    if (t2 > 0) t.push(t2);
    
    // Find the value that occurs within the game window
    if (t.length == 1) {
      t = t[0];
    } 
    else if (t.length == 2) {
      t = Math.min(t[0], t[1]);
    } 
    else {
      t = false;
    }
    
    if (t) {
      this.end_x = this.target.x;
      this.end_y = t * this.target.velocity + this.target.y;
      this.theta = Math.atan(((TYYP.c_height) - this.end_y) / this.end_x);
      this.vel_y = this.velocity * Math.sin(this.theta);
      this.vel_x = Math.sqrt(Math.pow(this.velocity, 2) - Math.pow(this.vel_y, 2));
    }
  }, 
  
  updatePosition: function() {     
    this.x += this.vel_x;
    this.y -= this.vel_y;
  },
  
  draw: function() {
    TYYP.ctx.fillStyle = "#000000";
    TYYP.ctx.fillRect(this.x, this.y, 3, 3);
    // ctx.fillStyle = "#ff0000";
    // ctx.fillRect(this.end_x, this.end_y, 3, 3);
    
  }
}