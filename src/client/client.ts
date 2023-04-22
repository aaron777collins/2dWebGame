import * as THREE from 'three'
import Stats from 'stats.js'

const scene = new THREE.Scene()

const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    1,
    1000
)
camera.position.z = 10

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const stats = new Stats()

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.left = window.innerWidth / -2
    camera.right = window.innerWidth / 2
    camera.top = window.innerHeight / 2
    camera.bottom = window.innerHeight / -2
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    stats.begin()
    update()
    render()
    stats.end()
    requestAnimationFrame(animate)
}

function update() {
    updateCharacter()
}

function render() {
    updateAnimation()
    renderer.render(scene, camera)
}

// Your addHelpText function remains the same

// Character movement and flipping logic
const character = {
    sprite: null,
    flipped: false,
    velocity: new THREE.Vector2(0, 0),
    speed: 3,
    speedFrictionRatio: 0.9,
    textures: [],
    attacking: false,
}

const enum DIRECTIONS {
    normal = 'normal',
    right = 'right',
    back = 'back',
}

type timeouttype = ReturnType<typeof setTimeout>

// frames go from right to left
const animationData = {
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

function createTextureAtlasGrid(atlasTexture, tilesHoriz, tilesVert, flipped = false) {
    const textures: THREE.Texture[] = []
    for (let i = 0; i < tilesVert; i++) {
        for (let j = tilesHoriz - 1; j >= 0; j--) {
            const tileTexture = atlasTexture.clone()
            tileTexture.needsUpdate = true
            tileTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert)
            tileTexture.offset.set(j / tilesHoriz, i / tilesVert)
            textures.push(tileTexture)
        }
    }
    return textures
}

function createCharacter(textureAtlas: THREE.Texture, tilesHoriz = 1, tilesVert = 1) {
    const textures = createTextureAtlasGrid(textureAtlas, tilesHoriz, tilesVert).reverse()

    textures.forEach((texture) => {
        // repeat mirror
        texture.wrapS = THREE.RepeatWrapping
    })

    const spriteMaterial = new THREE.SpriteMaterial({
        map: textures[0],
        color: 0xffffff,
    })
    spriteMaterial.side = THREE.DoubleSide
    spriteMaterial.transparent = true

    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(100, 100, 1)
    scene.add(sprite)

    return { sprite: sprite, textures: textures }
}

function updateAnimation() {
    if (animationData.previousAnimation !== animationData.currentAnimation) {
        // console.log('Reset')
        animationData.animationTimeOffset =
            -stats.domElement.ownerDocument.defaultView.performance.now()
    }

    animationData.previousAnimation = animationData.currentAnimation
    const anim = animationData[animationData.currentAnimation]
    if (!anim) return

    animationData.animationElapsedTime +=
        animationData.animationTimeOffset +
        stats.domElement.ownerDocument.defaultView.performance.now()

    if (animationData.animationElapsedTime >= animationData.animationDuration) {
        // regular adds framesMissing to startFrame but flipped does not
        const realStartFrame = anim.startFrame
        const realEndFrame = anim.endFrame

        const currentFrame =
            (realStartFrame +
                Math.floor(animationData.animationElapsedTime / animationData.animationDuration) -
                1) %
            (realEndFrame - realStartFrame + 1)

        if (
            currentFrame >= realEndFrame - realStartFrame + 1 - anim.framesMissing
        ) {
            character.attacking = false
            if (animationData.mostRecentDirection === DIRECTIONS.right) {
                animationData.currentAnimation = 'idleRight'
            } else if (animationData.mostRecentDirection === DIRECTIONS.back) {
                animationData.currentAnimation = 'idleBack'
            } else {
                animationData.currentAnimation = 'idle'
            }
            updateAnimation()
            return
        }

        // rotating sprite to face the other direction if flipped
        if (character.flipped) {
            character.sprite.material.map = character.textures[realEndFrame - currentFrame]
            character.sprite.material.map.offset.x =
                Math.abs(character.sprite.material.map.offset.x) * -1
            character.sprite.material.map.repeat.x =
                Math.abs(character.sprite.material.map.repeat.x) * -1
        } else {
            character.sprite.material.map = character.textures[realStartFrame + currentFrame]
            character.sprite.material.map.offset.x = Math.abs(
                character.sprite.material.map.offset.x
            )
            character.sprite.material.map.repeat.x = Math.abs(
                character.sprite.material.map.repeat.x
            )
        }
        character.sprite.material.needsUpdate = true
        animationData.animationElapsedTime = 0
    }
}

const KEY_STATES = {
    UP: false,
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    SPACE: false,
}

function handleKeyDown(event) {
    switch (event.code) {
        case 'ArrowLeft':
            KEY_STATES.LEFT = true
            KEY_STATES.RIGHT = false
            break
        case 'ArrowRight':
            KEY_STATES.RIGHT = true
            KEY_STATES.LEFT = false
            break
        case 'ArrowUp':
            KEY_STATES.UP = true
            KEY_STATES.DOWN = false
            break
        case 'ArrowDown':
            KEY_STATES.DOWN = true
            KEY_STATES.UP = false
            break
        case 'Space':
            KEY_STATES.SPACE = true
            break
    }
}

function handleKeyUp(event) {
    switch (event.code) {
        case 'ArrowLeft':
            KEY_STATES.LEFT = false
            break
        case 'ArrowRight':
            KEY_STATES.RIGHT = false
            break
        case 'ArrowUp':
            KEY_STATES.UP = false
            break
        case 'ArrowDown':
            KEY_STATES.DOWN = false
            break
        case 'Space':
            KEY_STATES.SPACE = false
            break
    }
}

function isFlipped() {
    // flipped if left is pressed.
    // not flipped if right, up or down is pressed.
    let flipped = character.flipped
    if (KEY_STATES.LEFT && !KEY_STATES.UP && !KEY_STATES.DOWN) {
        flipped = true
    } else if (KEY_STATES.RIGHT) {
        flipped = false
    } else if (KEY_STATES.UP) {
        flipped = false
    } else if (KEY_STATES.DOWN) {
        flipped = false
    }

    return flipped
}

function updateCharacter() {
    if (!character.attacking) {
        character.flipped = isFlipped()

        if (KEY_STATES.LEFT) {
            character.velocity.x = -character.speed
            animationData.currentAnimation = 'walkRight'
            animationData.mostRecentDirection = DIRECTIONS.right
        } else if (KEY_STATES.RIGHT) {
            character.velocity.x = character.speed
            animationData.currentAnimation = 'walkRight'
            animationData.mostRecentDirection = DIRECTIONS.right
        }
        if (KEY_STATES.UP) {
            character.velocity.y = character.speed
            animationData.currentAnimation = 'walkBack'
            animationData.mostRecentDirection = DIRECTIONS.back
        } else if (KEY_STATES.DOWN) {
            character.velocity.y = -character.speed
            animationData.currentAnimation = 'walk'
            animationData.mostRecentDirection = DIRECTIONS.normal
        }

        if (KEY_STATES.SPACE && !character.attacking) {
            character.attacking = true
            character.velocity.x /= 2
            character.velocity.y /= 2

            // attack
            if (animationData.mostRecentDirection === DIRECTIONS.normal) {
                animationData.currentAnimation = 'attack'
            } else if (animationData.mostRecentDirection === DIRECTIONS.back) {
                animationData.currentAnimation = 'attackBack'
            } else if (animationData.mostRecentDirection === DIRECTIONS.right) {
                animationData.currentAnimation = 'attackRight'
            } else {
                // should not be reached
                animationData.currentAnimation = 'attack'
            }
        }
    }

    character.velocity.x *= character.speedFrictionRatio
    if (Math.abs(character.velocity.x) < 0.1) {
        character.velocity.x = 0
    }

    character.velocity.y *= character.speedFrictionRatio
    if (Math.abs(character.velocity.y) < 0.1) {
        character.velocity.y = 0
    }

    // If no key is pressed, return to idle
    let animating = character.attacking // same as false || character.attacking
    Object.keys(KEY_STATES).forEach((key) => {
        if (KEY_STATES[key]) {
            animating = true
        }
    })
    if (!animating && character.velocity.x === 0 && character.velocity.y === 0) {
        if (animationData.mostRecentDirection === DIRECTIONS.normal) {
            animationData.currentAnimation = 'idle'
        } else if (animationData.mostRecentDirection === DIRECTIONS.back) {
            animationData.currentAnimation = 'idleBack'
        } else if (animationData.mostRecentDirection === DIRECTIONS.right) {
            animationData.currentAnimation = 'idleRight'
        } else {
            // should not be reached
            animationData.currentAnimation = 'idle'
        }
    }

    // Update character position
    character.sprite.position.x += character.velocity.x
    character.sprite.position.y += character.velocity.y
}

// Background-related logic
function createBackground() {
    const textureLoader = new THREE.TextureLoader()
    const backgroundTexture = textureLoader.load('/static/background.jpg')
    const backgroundMaterial = new THREE.SpriteMaterial({ map: backgroundTexture, color: 0xffffff })

    const background = new THREE.Sprite(backgroundMaterial)
    background.scale.set(2000, 1000, 1) // Adjust the scale according to your needs
    background.position.set(0, 0, -5) // Move background behind the character

    scene.add(background)
}

function removeHelpText() {
    document.getElementById('help-text').style.display = 'none';
    window.removeEventListener('keydown', removeHelpText)
}

function addHelpText() {
    // centered help text will disappear after 5 seconds and will also dissapear after pressing any key
    const helpText = document.createElement('div')
    helpText.innerHTML = 'Use the arrow keys to move and space to attack'
    helpText.style.position = 'absolute'
    helpText.style.top = '50%'
    helpText.style.left = '50%'
    helpText.style.transform = 'translate(-50%, -50%)'
    helpText.style.color = 'white'
    helpText.style.fontSize = '20px'
    helpText.style.fontFamily = 'sans-serif'
    helpText.style.zIndex = '1'
    helpText.id = 'help-text'
    document.body.appendChild(helpText)

    window.addEventListener('keydown', removeHelpText)
}

window.addEventListener('DOMContentLoaded', () => {

    // add help text
    addHelpText()


    // add stats
    document.body.appendChild(stats.dom)
    stats.showPanel(0)

    createBackground() // Add the background to the scene

    const textureLoader = new THREE.TextureLoader()
    const atlasTexture = textureLoader.load(
        '/static/character.png',
        (texture) => {
            //callback
            const characterData = createCharacter(
                atlasTexture,
                animationData.x_tiles,
                animationData.y_tiles
            ) // Assuming a 6x10 grid
            character.sprite = characterData.sprite
            character.textures = characterData.textures

            // Add event listeners for keyboard controls
            window.addEventListener('keydown', handleKeyDown)
            window.addEventListener('keyup', handleKeyUp)

            // Your help text and stats code remains the same
            animate()
        },
        (event) => {
            // onProgress
            // create loading dom in the middle of the page
            const loadingDom = document.createElement('div')

            loadingDom.style.position = 'absolute'
            loadingDom.style.top = '50%'
            loadingDom.style.left = '50%'
            loadingDom.style.transform = 'translate(-50%, -50%)'

            loadingDom.innerText = `${Math.round((event.loaded / event.total) * 100)}%`

            document.body.appendChild(loadingDom)
        },
        (err) => {
            // onError
            console.error('Unexpected error while loading texture: ', err)

            // display error message in the middle of the page
            const errorDom = document.createElement('div')

            errorDom.style.position = 'absolute'

            errorDom.style.top = '50%'
            errorDom.style.left = '50%'
            errorDom.style.transform = 'translate(-50%, -50%)'

            errorDom.innerText = 'Unexpected error while loading texture'

            document.body.appendChild(errorDom)
        }
    )
})
