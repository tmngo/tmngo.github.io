Vue.component('node-row-submission', {
	props: ['nodes'],
	data () {
		return {
			nextUniqueId: 5,
			newNodeX: '',
			newNodeY: '',
		}
	},
	methods: {
		submitNode() {
			this.$emit('submit-node', this.newNodeX, this.newNodeY);
			this.newNodeX = '';
			this.newNodeY = '';
		},
	},
	template: `
		<tr style="">
			<td></td>
			<td class="cell">
				<input 
					type="text" 
					class="cell-input form-control form-control-sm" 
					v-model="newNodeX" 
					placeholder="X" 
					oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1')"	
				/>
			</td>
			<td class="cell">
				<input 
					type="text" 
					class="cell-input form-control form-control-sm" 
					v-model="newNodeY" 
					@keyup.enter="submitNode" 
					placeholder="Y"
					oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1')" 
				/>
			</td>
			<td class="cell-button">
				<button 
					type="button" 
					class="btn btn-outline-success submit" 
					@click="submitNode" 
				>+</button>
			</td>
		</tr>
	`
});

Vue.component('node-row', {
	props: ['node', 'nodes'],
	data() {
		return {
			showOptions: false,
		};
	},
	computed: {
		optionsArrow () {
			return this.showOptions ? "\u25B2" : "\u25BC";
		}
	},
	template: `
		<tr>
		
			<td>
				<input class="cell-input form-control form-control-sm form-control-plaintext" 
						type="text" v-model="node.n"/>
			</td>
			<input-number class="cell" :node="node" :input-value="'x'"></input-number>
			<input-number class="cell" :node="node" :input-value="'y'"></input-number>
			<td class="cell-button">
				<button class="btn btn-outline-secondary options" type="button" 
						@click="showOptions=!showOptions">{{ optionsArrow }}</button>
				<button class="btn btn-outline-danger delete" type="button" 
						@click="$emit('remove')">&#x00d7;</button>
			</td>
			<input-number class="cell row-options" v-show="showOptions" :node="node" :input-value="'loadX'">
				<div class="input-group-text" style="background-color: #eccdcd">
					<input style="height: 100%" type="checkbox" v-model="node.rx">
				</div>
			</input-number>
			<input-number class="cell row-options" v-show="showOptions" :node="node" :input-value="'loadY'">
				<div class="input-group-text" style="background-color: #c0e9c0">
					<input style="height: 100%" type="checkbox" v-model="node.ry">
				</div>
			</input-number>
			<input-number class="cell row-options" v-show="showOptions" :node="node" :input-value="'loadZ'">
				<div class="input-group-text" style="background-color: #c0d6ec">
					<input style="height: 100%" type="checkbox" v-model="node.rz">
				</div>
			</input-number>
		</tr>
	`
});

Vue.component('input-number', {
	props: ['node', 'inputValue'],
	data() {
		return {
			showSpinner: false,
			step: 1,
		};
	},
	computed: {
  	hasSlotData() {
    	return this.$slots.default;
    }
  },
	template: `
		<td>
			<div class="input-group input-group-sm"
					@mouseover="showSpinner=true"	@mouseleave="showSpinner=false">
				<div v-if="hasSlotData" class="input-group-prepend">
					<slot></slot>
				</div>
				<input 
					type="number" 
					step=any
					class="no-spin cell-input form-control form-control-sm" 
					v-model.number="node[inputValue]"
					@focus="$event.target.select()"
				/>
				<div v-if="showSpinner" class="input-group-append btn-spinner" >
					<button class="btn btn-outline-secondary btn-increment" 
							type="button" @click="node[inputValue]+=step" tabindex="-1"
					>&#x25b5;</button>
					<button class="btn btn-outline-secondary btn-decrement" 
							type="button" @click="node[inputValue]-=step" tabindex="-1"
					>&#x25bf;</button>		
				</div>
			</div>
		</td>
	`
});

Vue.component('input-checkbox', {
	props: ['object', 'setting', 'id', 'label'],
	template: `
		<div class="form-check form-check-inline">
			<input class="form-check-input" type="checkbox" :id="id" v-model="object[setting]">
			<label class="form-check-label" :for="id">{{ label }}</label>
		</div>
	`
});

Vue.component('element-row-submission', {
	props: ['elements', 'nodes'],
	data() {
		return {
			newStart: '',
			newEnd: '',
		}		
	},
	methods: {
		submitElement() {
			this.$emit('submit-element', this.newStart, this.newEnd)
			this.newStart = ''
			this.newEnd = ''
		},
	},
	template: `
		<tr>
			<td></td>
			<td class="cell">
				<select class="cell-input form-control form-control-sm" 
						placeholder="#" v-model="newStart">
					<option selected disabled hidden value="">N1</option>	
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td class="cell">
				<select class="cell-input form-control form-control-sm" v-model="newEnd" 
						@keyup.enter="submitElement">
					<option selected disabled hidden value="">N2</option>		
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td class="cell-button"><button 
				type="button" 
				class="btn btn-outline-success submit" 
				@click="submitElement" 
			>+</button></td>
		</tr>
	`
});

Vue.component('element-row', {
	props: ['element', 'nodes'],
	data() {
		return {
			showOptions: false,
		};
	},
	computed: {
		optionsArrow () {
			return this.showOptions ? "\u25B2" : "\u25BC";
		},
		dX () {
			return this.element.end.x - this.element.start.x;
		},
		dY () {
			return this.element.end.y - this.element.start.y;
		},
		length () {
			return math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2));
		},
	},
	template: `
		<tr>
			<td>
				<input class="cell-input form-control form-control-sm form-control-plaintext" 
						type="text" v-model="element.n"/>
			</td>
			<td class="cell">
				<select class="cell cell-input form-control form-control-sm" v-model="element.start">
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td class="cell">
				<select class="cell-input form-control form-control-sm" v-model="element.end">
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td class="cell-button">
				<button type="button" class="btn btn-outline-secondary options" 
						@click="showOptions=!showOptions">{{ optionsArrow }}</button>
				<button type="button" class="btn btn-outline-danger delete"
						 @click="$emit(\'remove\')">&#x00d7;</button>
			</td>
			<input-number class="cell row-options" title="elastic modulus, E" 
					v-show="showOptions" :node="element" :input-value="'e'">
				<div class="input-group-text">E</div>
			</input-number>
			<input-number class="cell row-options" title="area, A" 
					v-show="showOptions" :node="element" :input-value="'a'">
				<div class="input-group-text">A</div>
			</input-number>
			<input-number class="cell row-options" title="moment of inertia, I_z" 
					v-show="showOptions" :node="element" :input-value="'iz'">
				<div class="input-group-text">I<sub>z</sub></div>
			</input-number>
			<td class="cell form-check form-check-inline row-options" style="justify-content: flex-start" v-show="showOptions">
				<input title="rigid start connection" class="form-check-input" type="checkbox" 
						v-model="element.startRigid">
				<label title="rigid start connection" class="form-check-label">Rigid start</label>
			</td>
			<td class="cell form-check form-check-inline row-options" style="justify-content: flex-start" v-show="showOptions">
				<input title="rigid end connection" class="form-check-input" type="checkbox" 
						v-model="element.endRigid">
				<label title="rigid end connection" class="form-check-label">Rigid end</label>
			</td>
		</tr>
	`
});

Vue.component('node-circle', {
	props: ['node', 'reactions', 'view'],
	computed: {
		dx () {
			return (this.node.x === "") ? 0 : this.node.x * this.view.scale;
		},
		dy () {
			return (this.node.y === "") ? 0 : this.node.y * this.view.scale;
		},
		x () {
			return this.view.x + this.dx;
		},
		y () {
			return this.view.y - this.dy;
		},
		fX () {
			return (this.node.loadX === "") ? 0 : this.node.loadX;
		},
		fY () {
			return (this.node.loadY === "") ? 0 : this.node.loadY;
		},
		f () {
			return math.sqrt(Math.pow(this.fX, 2) + Math.pow(this.fY, 2));
		},
		fRounded() {
			return math.round(this.f, this.view.decimalPlaces);
		},
		rxRounded() {
			return math.round(this.reactions.fx, this.view.decimalPlaces);
		},
		ryRounded() {
			return math.round(this.reactions.fy, this.view.decimalPlaces);
		},
		rzRounded() {
			return math.round(this.reactions.mz, this.view.decimalPlaces);
		},
		reactionXTriangle() {		
			return (this.x - 6) + ',' + (this.y) + ' ' 
					+ (this.x - 11) + ',' + (this.y - 4) + ' ' 
					+ (this.x - 11) + ',' + (this.y + 4);
		},
		reactionYTriangle() {
			return (this.x) + ',' + (this.y + 6) + ' ' 
					+ (this.x + 4) + ',' + (this.y + 11) + ' ' 
					+ (this.x - 4) + ',' + (this.y + 11);
		},
		reactionZTriangle() {
			return (this.x - 3.54) + ',' + (this.y + 3.54) + ' ' 
					+ (this.x - 9.9) + ',' + (this.y + 4.24) + ' ' 
					+ (this.x - 4.24) + ',' + (this.y + 9.9);
		},
		forcePathDefinition() {
			if (this.f === 0) return "";
			return 'M' + (this.x - 50 * this.fX / this.f) + ','
					+ (this.y + 50 * this.fY / this.f) + 'L' 
					+ (this.x - 10 * this.fX / this.f) + ',' 
					+ (this.y + 10 * this.fY / this.f);
		},
		forceTextX() {
			if (this.f === 0) return 0;
			return this.x - 55 * this.fX / this.f;
		},
		forceTextY() {
			if (this.f === 0) return 0;
			return this.y + 55 * this.fY / this.f;
		}
	},
	template: `
		<svg>
			<defs>
				<marker id="head" orient="auto"
					markerWidth="2" markerHeight="4"
					refX="0.1" refY="2">
					<path d="M0,0 V4 L2,2 Z" style="fill: #947Ebc"/>
				</marker>
			</defs>
			<circle class="circle-node" :cx="x" :cy="y" r="1.5"/>
			
			<circle class="circle-node" :cx="x + 10" :cy="y - 7" r="6.5" style="fill: #fff9; stroke: #bbb"/>
			<text v-show="view.nodeLabels" :x="x + 7" :y="y - 4" style="fill: #000; font-size: 0.625rem">{{ node.n }}</text>
			
			<path 
				class="path-force"
				v-show="view.appliedForces && f !== 0"
				:d="forcePathDefinition" 
				style="stroke: #947Ebc"
			/>
			<text 
				v-show="view.appliedForces && f !== 0" 
				:x="forceTextX" :y="forceTextY" text-anchor="middle" style="fill: #947Ebc"
			>{{ fRounded }}</text>
			<polygon class="triangle-support" v-show="node.rx && view.supports" 
					:points="reactionXTriangle" style="fill: #B22E0999"></polygon>
			<text v-show="view.reactions && node.rx" :x="x - 20" :y="y + 3" text-anchor="end" fill="#B42E09">{{ rxRounded }}</text>
			<polygon class="triangle-support" v-show="node.ry && view.supports" 
					:points="reactionYTriangle" style="fill: #72B22A99"></polygon>
			<text v-show="view.reactions && node.ry" :x="x" :y="y + 25" text-anchor="middle" fill="#52A23A">{{ ryRounded }}</text>
			<polygon class="triangle-support" v-show="node.rz && view.supports" 
					:points="reactionZTriangle" style="fill: #4167FF99"></polygon>
			<text v-show="view.reactions && node.rz" :x="x - 20" :y="y + 25" text-anchor="end" fill="#4167B7">{{ rzRounded }}</text>
		</svg>
	`
});

Vue.component('element-path', {
	props: ['element', 'element-force', 'view'],
	computed: {
		xStart () {
			return this.view.x + this.view.scale * this.element.start.x;
		},
		yStart () {
			return this.view.y - this.view.scale * this.element.start.y;
		},
		xEnd () {
			return this.view.x + this.view.scale * this.element.end.x;
		},
		yEnd () {
			return this.view.y - this.view.scale * this.element.end.y;
		},
		elementPathDefinition() {
			return 'M' + (this.xStart) + ',' + (this.yStart) 
					+ 'L' + (this.xEnd) + ',' + (this.yEnd);
		},
		forceRounded () {
			return math.round(this.elementForce, this.view.decimalPlaces);
		},	
		topRotate () {
			return (this.element.start.x < this.element.end.x) ? 0 : 180;
		},
		xMid () {
			return (this.xStart + this.xEnd) / 2;
		},
		yMid () {
			return (this.yStart + this.yEnd) / 2;
		},
		xStartOffset () {
			return this.xStart + (this.xEnd - this.xStart) * 0.125;
		},
		yStartOffset () {
			return this.yStart + (this.yEnd - this.yStart) * 0.125;
		},
		xEndOffset () {
			return this.xStart + (this.xEnd - this.xStart) * 0.875;
		},
		yEndOffset () {
			return this.yStart + (this.yEnd - this.yStart) * 0.875;
		},
		transformList () {
			return "rotate(" + this.topRotate + ' ' + this.xMid + ' ' + this.yMid + ')';
		},
	},
	template: `
		<svg>
			<path :id="'path' + element.id" class="path-element" :d="elementPathDefinition"></path>
			<circle class="circle-release" v-show="!element.startRigid" :cx="xStartOffset" :cy="yStartOffset" r="2"></circle>
			<circle class="circle-release" v-show="!element.endRigid" :cx="xEndOffset" :cy="yEndOffset" r="2"></circle>
			<text :transform="this.transformList" v-show="view.elementForces">
				<textPath :href="'#path' + element.id" startOffset="50%" text-anchor="middle">
					<tspan dy="-.25em">{{ this.forceRounded }}</tspan>
				</textPath>
			</text>
		</svg>
	`
});

let app = new Vue({
	el: '#app',
	data: {
		nodes: [],
		elements: [],
		nextUniqueId: 1,
		nextElementId: -1,
		viewSettings: {
			appliedForces: true,
			axes: true,
			decimalPlaces: 2,
			sigFigs: 3,
			display: false,
			elementForces: true,
			nodeLabels: true,
			x: 256,
			y: 200,
			reactions: true,
			scale: 3,
			scaleMax: 10,
			supports: true,
		},
		scroll: 0,
		canvasW: 512,
		canvasH: 472,
	},
	computed: {

		axisXDef () {
			return 'M0,' + this.viewSettings.y + 'L' + 1000 + ',' + this.viewSettings.y;
		},
		axisYDef () {
			return 'M' + this.viewSettings.x + ',0L' + this.viewSettings.x + ',' + 1000;
		},

		dof () {
			let n = 0;
			let arr = [];
			for (let i = 0; i < this.nodes.length; i++) {
				let node = this.nodes[i];
				if (!node.rx) {
					arr.push({
						n: n++, node: node, element: null, force: node.loadX, dir: "fx", support: false
					});
				}
				if (!node.ry) {
					arr.push({
						n: n++,node: node, element: null, force: node.loadY, dir: "fy", support: false
					});
				}
				
				let hasRigid = false;
				for (let j = 0; j < node.incElements.length; j++) {
					let element = node.incElements[j];
					if ((element.start === node && element.startRigid) || (element.end === node && element.endRigid)) {
						hasRigid = true;
					}
					if ((element.start === node && !element.startRigid) || (element.end === node && !element.endRigid)) {
						arr.push({
								n: n++, node: node, element: element, force: node.loadZ, dir: "mz", support: false
						});
					}
				}
				if (hasRigid && !node.rz) {
					arr.push({
						n: n++, node: node, element: null, force: node.loadZ, dir: "mz", support: false
					});
				}

			}
			for (let i = 0; i < this.nodes.length; i++) {
				let node = this.nodes[i];
				if (node.rx) {
					arr.push({
						n: n++, node: node, element: null, force: node.loadX, dir: "fx", support: true
					});
				}
				if (node.ry) {
					arr.push({
						n: n++, node: node, element: null, force: this.nodes[i].loadY, dir: "fy", support: true
					});
				}

				let hasRigid = false;
				for (let j = 0; j < node.incElements.length; j++) {
					let element = node.incElements[j];
					if ((element.start === node && element.startRigid) || (element.end === node && element.endRigid)) {
						hasRigid = true;
					}
				}
				if (hasRigid && node.rz) {
					arr.push({
						n: n++, node: node, element: null, force: node.loadZ, dir: "mz", support: true
					});
				}				
			}

			return arr;
		},

		numDegreesF () {
			let n = 0;
			for (let i = 0; i < this.dof.length; i++) {
				if (!this.dof[i].support) {
					n++;
				}
			}
			return n;
		},
		numDegreesS () {
			return this.dof.length - this.numDegreesF;
		},

		degreesF () {
			let arr = [];
			for (let i = 0; i < this.numDegreesF; i++) {
				arr.push(i);
			}
			return arr;
		},
		degreesS () {
			let arr = [];
			for (let i = this.numDegreesF; i < this.dof.length; i++) {
				arr.push(i);
			}
			return arr;
		},

		k () {
			let size  = this.dof.length;
			let k = Array(size).fill().map(() => Array(size).fill(0));
			for (let i = 0; i < this.elements.length; i++) {
				let m = this.elements[i];
				let dx = m.end.x - m.start.x;
				let dy = m.end.y - m.start.y;
				let l = math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
				let t = [
					[dx/l, dy/l, 0, 0, 0, 0], 
					[-dy/l, dx/l, 0, 0, 0, 0], 
					[0, 0, 1, 0, 0, 0], 
					[0, 0, 0, dx/l, dy/l, 0], 
					[0, 0, 0, -dy/l, dx/l, 0], 
					[0, 0 , 0, 0, 0, 1]
				];
				let a = m.a;
				let iz = m.iz;
				let l2 = l * l;
				let kLocal = math.multiply([
					[a, 0, 0, -a, 0, 0],
					[0, 12 * iz / l2, 6 * iz / l, 0, -12 *  iz / l2, 6 * iz / l],
					[0, 6 * iz / l, 4 * iz, 0, -6 *  iz / l, 2 * iz],
					[-a, 0, 0, a, 0, 0],
					[0, -12 * iz / l2, -6 * iz / l, 0, 12 *  iz / l2, -6 * iz / l],
					[0, 6 * iz / l, 2 * iz, 0, -6 *  iz / l, 4 * iz],
				], m.e / l);
				let kGlobal = math.multiply(math.transpose(t), kLocal, t);

				let x1 = this.getDOF(m.start, m, "fx").n;	
				let y1 = this.getDOF(m.start, m, "fy").n;	
				let z1 = this.getDOF(m.start, m, "mz").n;
				let x2 = this.getDOF(m.end, m, "fx").n;	
				let y2 = this.getDOF(m.end, m, "fy").n;	
				let z2 = this.getDOF(m.end, m, "mz").n;
				let d = [x1, y1, z1, x2, y2, z2];

				for (let r = 0; r < 6; r++) {
					for (let c = 0; c < 6; c++) {
						k[ d[r] ][ d[c] ] += kGlobal[r][c];
					}
				}
			}
			return k;
		},

		kFF () {
			if (this.degreesF.length === 0) {
				return 0;
			};
			return math.subset(this.k, math.index(this.degreesF, this.degreesF));
		},
		kSF () {
			return math.subset(this.k, math.index(this.degreesS, this.degreesF));
		},
		kSS () {
			return math.subset(this.k, math.index(this.degreesS, this.degreesS));
		},
	
		isStable() {
			return !math.equal(math.det(this.kFF), 0);
		},

		qF () {
			let arr = [];
			for (let i = 0; i < this.numDegreesF; i++) {
				arr.push(this.dof[i].force);
			}
			return arr;
		},

		dS () {
			let arr = [];
			for (let i = this.numDegreesF; i < this.dof.length; i++) {
				arr.push(0);
			}
			return arr;
		},

		dF () {
			return (!this.isStable) ? [] : math.multiply(math.inv(this.kFF), math.transpose(this.qF));
		},

		qS () {
			return (!this.isStable) ? [] : math.multiply(this.kSF, math.transpose(this.dF));
		},

		nodeReactions () {
			let arr = [];
			for (let i = 0; i < this.nodes.length; i++) {
				arr.push({
					fx: this.getNodeReaction(this.nodes[i], "fx"),
					fy: this.getNodeReaction(this.nodes[i], "fy"),
					mz: this.getNodeReaction(this.nodes[i], "mz")
				});
			}
			return arr;
		},

		elementForces () {
			let arr = [];
			for (let i = 0; i < this.elements.length; i++) {
				arr.push(this.getElementForce(this.elements[i]));
			}
			return arr;
		},

	},
	mounted: function () {
		this.addNode(48, 0, 0, -2);
		this.addNode(0, 36, 0, 0, 0, true, true);
		this.addNode(0, 0, 0, 0, 0, true, true);
		this.addNode(0, -36, 0, 0, 0, true, true);
		this.addElement(this.nodes[0], this.nodes[1], 1, 1, 1, false, false);
		this.addElement(this.nodes[0], this.nodes[2], 1, 1, 1, false, false);
		this.addElement(this.nodes[0], this.nodes[3], 1, 1, 1, false, false);
		this.canvasW = this.getCanvasWidth();
		this.canvasH = this.getCanvasHeight();
		this.viewSettings.x = this.canvasW / 2;
		this.viewSettings.y = this.canvasH / 2;
	},
	/* updated() {
		this.$nextTick(function () {
			this.canvasW = math.round(this.$refs.canvas.width.baseVal.value, 2);
			this.canvasH = math.round(this.$refs.canvas.height.baseVal.value, 2);
		});
	}, */
	methods: {

		zoomCanvas (d) {
			this.viewSettings.scale = Math.max(0, Math.min(this.viewSettings.scale + 0.1 * d, this.viewSettings.scaleMax));
		},

		getCanvasWidth() {
			return parseFloat(window.getComputedStyle(this.$refs.canvas)["width"]);
		},
		getCanvasHeight() {
			return parseFloat(window.getComputedStyle(this.$refs.canvas)["height"]);
		},

		addNode(x = 0, y = 0, qx = 0, qy = 0, qz = 0, rx = false, ry = false, rz = false) {
			this.nodes.push({ 
				id: this.nextUniqueId++,
				n: this.nodes.length + 1,
				x: x === '' ? 0 : x,
				y: y === '' ? 0 : y,
				loadX: qx,
				loadY: qy,
				loadZ: qz,
				rx: rx,
				ry: ry,		
				rz: rz,
				incElements: [], 
			});
		},

		addElement(start, end, e = 1, a = 1, iz = 1, startRigid = true, endRigid = true) {
			if (start !== "" && end !== "") {
				let newElement = {
					id: this.nextElementId--,
					n: this.elements.length + 1,
					start: start,
					end: end,
					startRigid: startRigid,
					endRigid: endRigid,
					e: e,
					a: a,
					iz: iz
				}
				this.elements.push(newElement);
				start.incElements.push(newElement);
				end.incElements.push(newElement);
			}
		},

		getDOF(node, element, dir) {
			for (let i = 0; i < this.dof.length; i++) {
				let d = this.dof[i];
				if (d.node === node && d.dir === dir && (d.element === null || d.element === element || element === null)) {
					return d;
				}
			}
		},

		getElementForce(element) {
			if (!this.isStable) return NaN;
			let dx = element.end.x - element.start.x;
			let dy = element.end.y - element.start.y;
			let l = math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

			let t = [-dx/l, -dy/l, dx/l, dy/l];
			let d = math.concat(this.dF, this.dS, 0);

			let dM = [
				d[this.getDOF(element.start, element, "fx").n], 
				d[this.getDOF(element.start, element, "fy").n],
				d[this.getDOF(element.end, element, "fx").n], 
				d[this.getDOF(element.end, element, "fy").n]
			];
			return (element.e * element.a / l) * math.dot(t, dM);
		},

		getNodeReaction(node, dir) {
			if (!this.isStable) return NaN;
			let q = math.concat(this.qF, this.qS, 0);
			let n = this.getDOF(node, null, dir).n;
			return q[n];
		},

		removeNode(nodeArr, elementArr, node) {
			let index = 0;
			for (let i = 0; i < nodeArr.length; i++) {
				if (nodeArr[i] === node) index = i;
			}
			this.removeNodeByIndex(nodeArr, elementArr, index);			
		},

		removeNodeByIndex(nodeArr, elementArr, index) {
			for (let i = 0; i < elementArr.length; i++) {
				if (elementArr[i].start.n === nodeArr[index].n || 
							elementArr[i].end.n === nodeArr[index].n) {
					this.removeElementByIndex(elementArr, i);
					i--;
				}
			}
			nodeArr.splice(index, 1);
		},

		removeNodeOnly(nodeArr, index) {
			nodeArr.splice(index, 1);
		},

		removeElementIncidence(element) {
			let incStart = element.start.incElements;	
			let incEnd = element.end.incElements;
			for (let i = 0; i < incStart.length; i++) {
				if (incStart[i] === element) incStart.splice(i, 1);
			}
			for (let j = 0; j < incEnd.length; j++) {
				if (incEnd[j] === element) incEnd.splice(j, 1);
			}
		},

		removeElementByIndex(elementArr, index) {
			let incStart = elementArr[index].start.incElements;	
			let incEnd = elementArr[index].end.incElements;
			for (let i = 0; i < incStart.length; i++) {
				if (incStart[i] === elementArr[index]) incStart.splice(i, 1);
			}
			for (let j = 0; j < incEnd.length; j++) {
				if (incEnd[j] === elementArr[index]) incEnd.splice(j, 1);
			}
			elementArr.splice(index, 1);
		},	
		
		isStaticallyDeterminate () {
			return (this.elements.length + this.nReactions === 2 * this.nodes.length);
		},

		isSimple() {
			let nodes = _.cloneDeep(this.nodes);
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].incElements.length === 2) {
					this.removeElementIncidence(nodes[i].incElements[1]);
					this.removeElementIncidence(nodes[i].incElements[0]);
					this.removeNodeOnly(nodes, i);
					i = 0;
				}
			}
			return (nodes.length === 2 && nodes[0].incElements.length === 1);
		},

		containsTriangle() {
			for (let i = 0; i < this.elements.length; i++) {
				let s = this.elements[i].start;
				let e = this.elements[i].end;	
				for (let j = 0; j < this.nodes.length; j++) {
					let n = this.nodes[j];	
					let hasStartLeg = false;
					let hasEndLeg = false;
					for (let k = 0; k < n.incElements.length; k++) {
						let m = n.incElements[k];		
						if ((m.start === n && m.end === s) || (m.start === s && m.end === n)) {
							hasStartLeg = true;
						}
						if ((m.start === n && m.end == e) || (m.start === e && m.end === n)) {
							hasEndLeg = true;
						}
					}					
					if (hasStartLeg && hasEndLeg) return true;
				}
			}
			return false;
		},

	}
});	