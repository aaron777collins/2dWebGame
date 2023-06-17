import { Character } from "../../models/Character";
import { stats } from "../client";

// frames go from right to left
export const characterAnimationData = {
    idle: {
        startFrame: 0,
        endFrame: 5,
        framesMissing: 0,
    },
    idleRight: {
        startFrame: 6,
        endFrame: 11,
        framesMissing: 0,
    },
    idleBack: {
        startFrame: 12,
        endFrame: 17,
        framesMissing: 0,
    },
    walk: {
        startFrame: 18,
        endFrame: 23,
        framesMissing: 0,
    },
    walkRight: {
        startFrame: 24,
        endFrame: 29,
        framesMissing: 0,
    },
    walkBack: {
        startFrame: 30,
        endFrame: 35,
        framesMissing: 0,
    },
    attack: {
        startFrame: 36,
        endFrame: 41,
        framesMissing: 2,
    },
    attackRight: {
        startFrame: 42,
        endFrame: 47,
        framesMissing: 2,
    },
    attackBack: {
        startFrame: 48,
        endFrame: 53,
        framesMissing: 2,
    },
    die: {
        startFrame: 54,
        endFrame: 59,
        framesMissing: 3,
    },
    mostRecentDirection: DIRECTIONS.normal,
    // Add more animations here

    currentAnimation: 'idle',
    previousAnimation: '',
    animationElapsedTime: 0,
    animationDuration: 100, // In milliseconds
    animationTimeOffset: 0,
    x_tiles: 6,
    y_tiles: 10,
}

export const blockAnimationData = {
    grasslight: {
        startFrame: 0,
        endFrame: 4,
        framesMissing: 0,
    },
    grassdark: {
        startFrame: 5,
        endFrame: 10,
        framesMissing: 0,
    },
    animationElapsedTime: 0,
    animationDuration: 100, // In milliseconds
    animationTimeOffset: 0,
    x_tiles: 5,
    y_tiles: 2,
}


export const enum DIRECTIONS {
    normal = 'normal',
    right = 'right',
    back = 'back',
}

export class CharacterAnimation {

    character: Character;

    constructor(character: Character) {
        this.character = character;
    }

    updateAnimations() {
        this.updateCharacterAnimation();
    }

    updateCharacterAnimation() {
        if (characterAnimationData.previousAnimation !== characterAnimationData.currentAnimation) {
            // console.log('Reset')
            characterAnimationData.animationTimeOffset =
                -stats.domElement.ownerDocument.defaultView.performance.now()
        }

        characterAnimationData.previousAnimation = characterAnimationData.currentAnimation
        const anim = characterAnimationData[characterAnimationData.currentAnimation]
        if (!anim) return

        characterAnimationData.animationElapsedTime +=
            characterAnimationData.animationTimeOffset +
            stats.domElement.ownerDocument.defaultView.performance.now()

        if (characterAnimationData.animationElapsedTime >= characterAnimationData.animationDuration) {
            // regular adds framesMissing to startFrame but flipped does not
            const realStartFrame = anim.startFrame
            const realEndFrame = anim.endFrame

            const currentFrame =
                (realStartFrame +
                    Math.floor(characterAnimationData.animationElapsedTime / characterAnimationData.animationDuration) -
                    1) %
                (realEndFrame - realStartFrame + 1)

            if (
                currentFrame >= realEndFrame - realStartFrame + 1 - anim.framesMissing
            ) {
                this.character.attacking = false
                if (characterAnimationData.mostRecentDirection === DIRECTIONS.right) {
                    characterAnimationData.currentAnimation = 'idleRight'
                } else if (characterAnimationData.mostRecentDirection === DIRECTIONS.back) {
                    characterAnimationData.currentAnimation = 'idleBack'
                } else {
                    characterAnimationData.currentAnimation = 'idle'
                }
                this.updateCharacterAnimation()
                return
            }

            // rotating sprite to face the other direction if flipped
            if (this.character.flipped) {
                this.character.sprite.material.map = this.character.textures[realEndFrame - currentFrame]
                this.character.sprite.material.map.offset.x =
                    Math.abs(this.character.sprite.material.map.offset.x) * -1
                this.character.sprite.material.map.repeat.x =
                    Math.abs(this.character.sprite.material.map.repeat.x) * -1
            } else {
                this.character.sprite.material.map = this.character.textures[realStartFrame + currentFrame]
                this.character.sprite.material.map.offset.x = Math.abs(
                    this.character.sprite.material.map.offset.x
                )
                this.character.sprite.material.map.repeat.x = Math.abs(
                    this.character.sprite.material.map.repeat.x
                )
            }
            this.character.sprite.material.needsUpdate = true
            characterAnimationData.animationElapsedTime = 0
        }
    }

}

