import { Vector2 } from "three";

export interface Character {
    sprite: any,
    flipped: boolean,
    velocity: Vector2
    speed: number,
    speedFrictionRatio: number,
    textures: Array<any>,
    attacking: boolean,
    slowDownCoefficientOnAttack: number,

}
