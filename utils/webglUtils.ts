// utils/webglUtils.ts

const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  uniform float u_progress;
  uniform bool u_isMinimizing;
  uniform vec2 u_iconPosition;

  void main() {
    v_texCoord = a_texCoord;
    vec2 position = a_position;
    
    // Calculate distance from the icon
    float distFromIcon = distance(position, u_iconPosition);
    
    // Apply genie effect
    if (u_isMinimizing) {
      position = mix(position, u_iconPosition, u_progress * (1.0 - distFromIcon));
    } else {
      position = mix(u_iconPosition, position, u_progress * (1.0 - distFromIcon * 0.5));
    }
    
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  uniform sampler2D u_image;
  varying vec2 v_texCoord;

  void main() {
    gl_FragColor = texture2D(u_image, v_texCoord);
  }
`;

export function initShaders(gl: WebGLRenderingContext): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  if (!vertexShader || !fragmentShader) {
    console.error('Failed to create shaders');
    return null;
  }
  
  return createProgram(gl, vertexShader, fragmentShader);
}

export function setupGeometry(gl: WebGLRenderingContext) {
  const positions = new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]);

  const texCoords = new Float32Array([
    0, 1,
    1, 1,
    0, 0,
    0, 0,
    1, 1,
    1, 0,
  ]);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

  return { positions, texCoords };
}

export function animate(
  gl: WebGLRenderingContext, 
  program: WebGLProgram | null, 
  positions: Float32Array, 
  texCoords: Float32Array, 
  progress: number,
  isMinimizing: boolean,
  iconPosition: { x: number, y: number }
) {
  if (!program) {
    console.error('WebGL program is null');
    return;
  }

  gl.useProgram(program);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  const progressLocation = gl.getUniformLocation(program, "u_progress");
  gl.uniform1f(progressLocation, progress);

  const isMinimizingLocation = gl.getUniformLocation(program, "u_isMinimizing");
  gl.uniform1i(isMinimizingLocation, isMinimizing ? 1 : 0);

  const iconPositionLocation = gl.getUniformLocation(program, "u_iconPosition");
  gl.uniform2f(iconPositionLocation, iconPosition.x, iconPosition.y);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) {
    console.error('Failed to create shader');
    return null;
  }
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) {
    console.error('Failed to create program');
    return null;
  }
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}