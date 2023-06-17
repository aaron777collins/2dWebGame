import { stats } from "../client";

export class BlockAnimation {
    startFrame: number;
    endFrame: number;
    framesMissing: number;
    animationElapsedTime: number;
    animationDuration: number;
    animationTimeOffset: number;
    textures: THREE.Texture[];
    texture: THREE.Texture;

    constructor(startFrame: number, endFrame: number, framesMissing: number, animationDuration: number, textures: THREE.Texture[]) {
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.framesMissing = framesMissing;
        this.animationElapsedTime = 0;
        this.animationDuration = animationDuration;
        this.animationTimeOffset = 0;
        this.textures = textures;
    }

    updateAnimation(sprite: THREE.Sprite) {
        const anim = {
            startFrame: this.startFrame,
            endFrame: this.endFrame,
            framesMissing: this.framesMissing,
        };

        // Check if there is an animation, if not return
        if (!anim) return;

        if (!this.textures) {
            console.log("No block textures");
            throw new Error("No block textures");
        }

        this.animationElapsedTime +=
            this.animationTimeOffset +
            stats.domElement.ownerDocument.defaultView.performance.now();

        if (this.animationElapsedTime >= this.animationDuration) {
            const realStartFrame = anim.startFrame;
            const realEndFrame = anim.endFrame;

            const currentFrame =
                (realStartFrame +
                    Math.floor(this.animationElapsedTime / this.animationDuration) -
                    1) %
                (realEndFrame - realStartFrame + 1);

            // If the current frame exceeds the actual frames (considering framesMissing), reset the animation
            if (currentFrame >= realEndFrame - realStartFrame + 1 - anim.framesMissing) {
                this.animationElapsedTime = 0;
                this.updateAnimation(sprite);
                return;
            }

            // Updating the texture from the texture sheet
            this.texture = this.textures[realStartFrame + currentFrame];

            this.texture.offset.x = Math.abs(this.texture.offset.x);
            this.texture.repeat.x = Math.abs(this.texture.repeat.x);

            this.texture.needsUpdate = true;
            this.animationElapsedTime = 0;

            // Updating the sprite
            sprite.material.map = this.texture;
        }
    }

}
