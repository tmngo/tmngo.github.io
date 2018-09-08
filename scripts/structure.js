Vue.component('table-array', {
	props: ['heading', 'array'],
	template: `
		<table class="table table-sm">
			<thead class="thead-dark">
				<tr>
					<th style="grid-column: span 9">
						{{ heading }} ({{ array.length }}) 
						<button 
							class="btn btn-outline-dark" 
							@click="$emit('expand')"
							style="margin-left: 0.5rem; "
						><i class="icon-unfold-more"></i></button>
						<button 
								class="btn btn-outline-dark" 
								@click="$emit('collapse')"
						><i class="icon-unfold-less"></i></button>
					</th>
					
				</tr>
				<slot name="header"></slot>
			</thead>
			<transition-group name="list" tag="tbody">
				<slot></slot>
			</transition-group>
		</table>
	`
});

Vue.component('node-row-add', {
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
			this.$emit('submit', this.newNodeX, this.newNodeY);
			this.newNodeX = '';
			this.newNodeY = '';
		},
	},
	template: `
		<tr class="table-dark row-submission">
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
				><b><i class="icon-add"></i></b></button>
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
		<tr class="list-item">
			<td style="justify-content: flex-end">
				<input class="cell-input form-control form-control-sm form-control-plaintext" 
						type="text" v-model="node.n"/>
			</td>
			<input-number class="cell" :node="node" :input-value="'x'"></input-number>
			<input-number class="cell" :node="node" :input-value="'y'"></input-number>
			<td class="cell-button">
				<button class="btn btn-outline-secondary options" type="button" 
						@click="showOptions=!showOptions"><i :class="{ 'icon-expand-more': !showOptions, 'icon-expand-less': showOptions }"></i></button>
				<button class="btn btn-outline-danger delete" type="button" 
						@click="$emit('remove')"><i class="icon-close"></i></button>
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
	props: {
		node: Object,
		inputValue: String,
		step: {
			type: Number,
			default: 1,
		}
	},
	data() {
		return {
			showSpinner: false,
			timeout: null,
			interval: null
		};
	},
	computed: {
  	hasSlotData() {
    	return this.$slots.default;
    }
	},
	methods: {
		increment(step) {
			this.node[this.inputValue] += step;
			this.timeout = setTimeout(() => {
				this.interval = setInterval(() => { 
					this.node[this.inputValue] += step;
				}, 50);
			}, 250);
		}, 
		clearTiming() {
			clearTimeout(this.timeout);
			clearInterval(this.interval);
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
							type="button" @mousedown="increment(step)" @mouseup="clearTiming" @mouseleave="clearTiming" tabindex="-1"
					>&#x25b5;</button>
					<button class="btn btn-outline-secondary btn-decrement" 
							type="button" @mousedown="increment(-step)" @mouseup="clearTiming" @mouseleave="clearTiming" tabindex="-1"
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

Vue.component('element-row-add', {
	props: ['elements', 'nodes'],
	data() {
		return {
			newStart: '',
			newEnd: '',
		}		
	},
	methods: {
		submitElement() {
			this.$emit('submit', this.newStart, this.newEnd)
			this.newStart = ''
			this.newEnd = ''
		},
	},
	template: `
		<tr class="table-dark row-submission">
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
			><i class="icon-add"></i></button></td>
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
		<tr class="list-item">
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
						@click="showOptions=!showOptions"><i :class="{ 'icon-expand-more': !showOptions, 'icon-expand-less': showOptions }"></i></button>
				<button type="button" class="btn btn-outline-danger delete"
						 @click="$emit(\'remove\')"><i class="icon-close"></i></button>
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
			<input-number class="cell row-options" title="area, A" 
					v-show="showOptions" :node="element" :input-value="'w'">
				<div class="input-group-text">w</div>
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
		mZ () {
			return (this.node.loadZ === "") ? 0 : this.node.loadZ;
		},
		f () {
			return math.sqrt(Math.pow(this.fX, 2) + Math.pow(this.fY, 2));
		},
		fRounded() {
			return math.round(this.f, this.view.decimalPlaces);
		},
		mZRounded () {
			return math.round(this.mZ, this.view.decimalPlaces) * math.sign(this.mZ);
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
		momentPathDefinition() {
			if (this.mZ === 0) return "";
			return 'M' + (this.x - 7.5) + ',' + (this.y + 13 * math.sign(this.mZ)) 
					+ 'A 15 15 0 1 ' + ((math.sign(this.mZ) - 1) / -2)
					+ (this.x - 7.5) + ',' + (this.y - 13 * math.sign(this.mZ));
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
					markerWidth="4" markerHeight="5"
					refX="1.3" refY="2">
					<path d="M0,0 L2,2 L0,4" style="stroke: #947Ebc; fill: none"/>
				</marker>
			</defs>
			<circle class="circle-node" :cx="x" :cy="y" r="1.5"/>
			
			<circle class="circle-node" v-show="view.nodeLabels" :cx="x" :cy="y" r="5" style="fill: #fff; stroke: #000"/>
			<text v-show="view.nodeLabels" :x="x" :y="y + 3.5" text-anchor="middle" style="fill: #000; font-size: 0.625rem">{{ node.n }}</text>
			
			<path 
				class="path-force"
				v-show="view.appliedForces && f !== 0"
				:d="forcePathDefinition" 
			/>
			<text 
				v-show="view.appliedForces && f !== 0" 
				:x="forceTextX" :y="forceTextY" 
				text-anchor="middle" style="fill: #947Ebc"
			>{{ fRounded }}</text>

			<path 
				class="path-force"
				v-show="view.appliedForces && mZ !== 0"
				:d="momentPathDefinition"
				style="fill: none;"
			/>
			<text 
				v-show="view.appliedForces && mZ !== 0" 
				:x="x + 13" :y="y - 13" 
				style="fill: #947Ebc"
			>{{ mZRounded }}</text>

			<polygon class="triangle-support" v-show="node.rx && view.supports" 
					:points="reactionXTriangle" style="fill: #B22E0999"/>
			<text v-show="view.reactions && node.rx" :x="x - 20" :y="y + 3" text-anchor="end" fill="#B42E09">{{ rxRounded }}</text>
			<polygon class="triangle-support" v-show="node.ry && view.supports" 
					:points="reactionYTriangle" style="fill: #72B22A99"/>
			<text v-show="view.reactions && node.ry" :x="x" :y="y + 25" text-anchor="middle" fill="#52A23A">{{ ryRounded }}</text>
			<polygon class="triangle-support" v-show="node.rz && view.supports" 
					:points="reactionZTriangle" style="fill: #4167FF99"/>
			<text v-show="view.reactions && node.rz" :x="x - 20" :y="y + 25" text-anchor="end" fill="#4167B7">{{ rzRounded }}</text>
		</svg>
	`
});

Vue.component('element-path', {
	props: ['element', 'element-force', 'view'],
	computed: {
		l () {
			return Math.sqrt((this.xEnd - this.xStart) * (this.xEnd - this.xStart) + 
					(this.yEnd - this.yStart) * (this.yEnd - this.yStart));
		},
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
		wPathDefinition() {
			let str = 'm' + 16 * (-this.yStart + this.yEnd) / this.l * Math.sign(this.element.w) + ',' + 16 * (-this.xEnd + this.xStart) / this.l * Math.sign(this.element.w)
			+ 'l' + (this.xEnd - this.xStart) / 3 * Math.sign(this.element.w) + ',' + (this.yEnd - this.yStart) / 3 * Math.sign(this.element.w)
			+ 'l' + (this.xEnd - this.xStart) / 3 * Math.sign(this.element.w) + ',' + (this.yEnd - this.yStart) / 3 * Math.sign(this.element.w)
			+ 'l' + (this.xEnd - this.xStart) / 3 * Math.sign(this.element.w) + ',' + (this.yEnd - this.yStart) / 3 * Math.sign(this.element.w);
			if (Math.sign(this.element.w) === 1) {
				return 'M' + (this.xStart) + ',' + (this.yStart) + str;
			} else {
				return 'M' + (this.xEnd) + ',' + (this.yEnd) + str;
			}
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
			<defs>
				<marker id="arrow" orient="auto"
					markerWidth="2" markerHeight="20"
					refX="0" :refY="0">
					<path :d="'M0,' + 0 + ' L0,' + 10" style="stroke: #947Ebc; fill: none" marker-end="url(#head)"/>
				</marker>
			</defs>
			<path :id="'path' + element.id" class="path-element" :d="elementPathDefinition"/>
			<path :id="'pathw' + element.id" v-show="element.w !== 0 && view.elementLoads" class="path-element-load" :d="wPathDefinition"/>

			<circle class="circle-release" v-show="!element.startRigid" :cx="xStartOffset" :cy="yStartOffset" r="2"/>
			<circle class="circle-release" v-show="!element.endRigid" :cx="xEndOffset" :cy="yEndOffset" r="2"/>
			<text :transform="transformList" v-show="view.elementForces">
				<textPath :href="'#path' + element.id" startOffset="50%" text-anchor="middle">
					<tspan dy="-.25em">{{ forceRounded }}</tspan>
				</textPath>
			</text>
			<text v-show="element.w !== 0 && view.elementLoads">
				<textPath :href="'#pathw' + element.id" startOffset="50%" text-anchor="middle">
					<tspan style="fill: #947Ebc" dy="-0.25em">{{ Math.abs(element.w) }}</tspan>
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
			elementLoads: true,
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
		captureToggle: false,
		panX: 0,
		panY: 0,
	},
	computed: {

		axisXDef () {
			return 'M0,' + this.viewSettings.y + 'L' + 1000 + ',' + this.viewSettings.y;
		},
		axisYDef () {
			return 'M' + this.viewSettings.x + ',0L' + this.viewSettings.x + ',' + 1000;
		},

		dofF () {
			let n = 0;
			let arr = [];
			for (let i = 0; i < this.nodes.length; i++) {
				let node = this.nodes[i];
				if (!node.rx) arr.push({ n: n++, node: node, element: null, force: node.loadX, dir: "fx", support: false });
				if (!node.ry) arr.push({ n: n++,node: node, element: null, force: node.loadY, dir: "fy", support: false });
				
				let hasRigid = false;
				for (let j = 0; j < node.incElements.length; j++) {
					let element = node.incElements[j];
					if ((element.start === node && element.startRigid) || (element.end === node && element.endRigid)) hasRigid = true;
					if ((element.start === node && !element.startRigid) || (element.end === node && !element.endRigid)) {
						arr.push({ n: n++, node: node, element: element, force: node.loadZ, dir: "mz", support: false });
					}
				}
				if (hasRigid && !node.rz) arr.push({ n: n++, node: node, element: null, force: node.loadZ, dir: "mz", support: false });
			}
			return arr;
		},

		dofS () {
			let n = this.nF;
			let arr = [];
			for (let i = 0; i < this.nodes.length; i++) {
				let node = this.nodes[i];
				if (node.rx) arr.push({ n: n++, node: node, element: null, force: node.loadX, dir: "fx", support: true });
				if (node.ry) arr.push({ n: n++, node: node, element: null, force: this.nodes[i].loadY, dir: "fy", support: true });

				let hasRigid = false;
				for (let j = 0; j < node.incElements.length; j++) {
					let element = node.incElements[j];
					if ((element.start === node && element.startRigid) || (element.end === node && element.endRigid)) hasRigid = true;
				}
				if (hasRigid && node.rz) arr.push({ n: n++, node: node, element: null, force: node.loadZ, dir: "mz", support: true });		
			}
			return arr;
		},

		dof () {
			return this.dofF.concat(this.dofS);
		},

		nF () {
			return this.dofF.length;
		},
		nS () {
			return this.dofS.length;
		},
		keysF () {
			return Array.from(this.dofF.keys());
		},
		keysS () {
			return Array.from(this.dofS.keys()).map(x => x + this.nF);
		},

		k () {
			let size  = this.dof.length;
			let arr = Array(size).fill().map(() => Array(size).fill(0));
			for (let j = 0; j < this.elements.length; j++) {
				let el = this.elements[j];
				let dx = el.end.x - el.start.x;
				let dy = el.end.y - el.start.y;
				let l = math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
				let t = [
					[dx/l, dy/l, 0, 0, 0, 0], 
					[-dy/l, dx/l, 0, 0, 0, 0], 
					[0, 0, 1, 0, 0, 0], 
					[0, 0, 0, dx/l, dy/l, 0], 
					[0, 0, 0, -dy/l, dx/l, 0], 
					[0, 0 , 0, 0, 0, 1]
				];
				let a = el.a;
				let i = el.iz;
				let l2 = l * l;
				let kLocal = math.multiply([
					[a, 0, 0, -a, 0, 0],
					[0, 12*i/l2, 6*i/l, 0, -12*i/l2, 6*i/l],
					[0, 6*i/l, 4*i, 0, -6*i/l, 2*i],
					[-a, 0, 0, a, 0, 0],
					[0, -12*i/l2, -6*i/l, 0, 12*i/l2, -6*i/l],
					[0, 6*i/l, 2*i, 0, -6*i/l, 4*i],
				], el.e / l);
				let kGlobal = math.multiply(math.transpose(t), kLocal, t);
				let d = [
					this.getDOF(el.start, "fx").n, 
					this.getDOF(el.start, "fy").n, 
					(!el.startRigid) ? this.getDOF(el.start, "mz", el).n : this.getDOF(el.start, "mz").n, 
					this.getDOF(el.end, "fx").n, 
					this.getDOF(el.end, "fy").n, 
					(!el.endRigid) ? this.getDOF(el.end, "mz", el).n : this.getDOF(el.end, "mz").n
				];
				for (let r = 0; r < 6; r++) {
					for (let c = 0; c < 6; c++) {
						arr[ d[r] ][ d[c] ] += kGlobal[r][c];
					}
				}
			}
			return arr;
		},

		kFF () {
			if (this.k.length === 0 || this.nF === 0) return [];
			return math.subset(this.k, math.index(this.keysF, this.keysF));
		},
		kSF () {
			if (this.nF === 0 || this.nS === 0) return [];
			return math.subset(this.k, math.index(this.keysS, this.keysF));
		},

		kSS () {
			if (this.nF === 0 || this.nS === 0) return [];
			return math.subset(this.k, math.index(this.keysS, this.keysS));
		},

		isStable() {
			if (this.kFF.length === 0) return true;
			return !math.equal(math.det(this.kFF), 0);
		},

		qF () {
			return this.dofF.map(deg => deg.force);
		},

		qS0 () {
			return this.dofS.map(deg => deg.force);
		},

		qS () {
			if (this.kSF.length === 0 && math.transpose(this.dF).length === 0) return [];
			return (!this.isStable) ? [] : math.subtract(math.add(math.multiply(this.kSF, math.transpose(this.dF)), this.qWS), this.qS0);
		},

		dF () {
			if (this.kFF.length === 0 && math.transpose(math.subtract(this.qF, this.qWF)).length === 0) return [];
			return (!this.isStable) ? [] : math.multiply(math.inv(this.kFF), math.transpose(math.subtract(this.qF, this.qWF)));
		},
		
		dS () {
			return Array(this.nS).fill(0);
		},

		qW () {
			let arr = [];
			for (let i = 0; i < this.dof.length; i++) {
				let deg = this.dof[i];
				let equiv = 0;
				for(let j = 0; j < deg.node.incElements.length; j++) {
					let elem = deg.node.incElements[j];
					let dx = elem.end.x - elem.start.x;
					let dy = elem.end.y - elem.start.y;
					let l = math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
						if (deg.dir === "fx") {
							equiv += elem.w * l / 2 * (-dy / l);
						} else if (deg.dir === "fy") {
							equiv += elem.w * l / 2 * (dx / l);
						}	else if (deg.node === elem.start && (deg.element === elem || (deg.element === null && elem.startRigid))) {
							equiv += elem.w * l * l / 12;
						} else if (deg.node === elem.end && (deg.element === elem || (deg.element === null && elem.endRigid))) {
							equiv -= elem.w * l * l / 12;
						}
				}
				arr.push(equiv);
			}
			return arr;
		},

		qWF () {
			if (this.keysF.length === 0) {
				return [];
			}
			return math.subset(this.qW, math.index(this.keysF));
		},

		qWS () {
			return math.subset(this.qW, math.index(this.keysS));
		},
		
		nodeReactions () {
			return this.nodes.map(n => ({ 
				fx: this.getNodeReaction(n, "fx"),
				fy: this.getNodeReaction(n, "fy"),
				mz: this.getNodeReaction(n, "mz")
			}))
		},

		elementForces () {
			return this.elements.map(el => this.getElementForce(el))
		},

	},
	created: function () {
		this.addNode(48, 0, 0, -2);
		this.addNode(0, 36, 0, 0, 0, true, true);
		this.addNode(0, 0, 0, 0, 0, true, true);
		this.addNode(0, -36, 0, 0, 0, true, true);
		this.addElement(this.nodes[0], this.nodes[1], 1, 1, 1, false, false);
		this.addElement(this.nodes[0], this.nodes[2], 1, 1, 1, false, false);
		this.addElement(this.nodes[0], this.nodes[3], 1, 1, 1, false, false);
	},
	mounted: function () {
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
			if (start !== "" && end !== "" && (start != end)) {
				let newElement = {
					id: this.nextElementId--,
					n: this.elements.length + 1,
					start: start,
					end: end,
					startRigid: startRigid,
					endRigid: endRigid,
					e: e,
					a: a,
					iz: iz,
					w: 0,
				}
				this.elements.push(newElement);
				start.incElements.push(newElement);
				end.incElements.push(newElement);
			}
		},

		getDOF(node, dir, elem = null) {
			for (let i = 0; i < this.dof.length; i++) {
				let d = this.dof[i];
				if (d.node === node && d.dir === dir && (d.element === elem )) {
					return d;
				}
			}
			return null;
		},

		getElementForce(elem) {
			if (!this.isStable) return NaN;
			let dx = elem.end.x - elem.start.x;
			let dy = elem.end.y - elem.start.y;
			let l = math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

			let t = [-dx/l, -dy/l, dx/l, dy/l];
			let d = this.dF.concat(this.dS);

			let dM = [
				d[this.getDOF(elem.start, "fx").n], 
				d[this.getDOF(elem.start, "fy").n],
				d[this.getDOF(elem.end, "fx").n], 
				d[this.getDOF(elem.end, "fy").n]
			];
			return (elem.e * elem.a / l) * math.dot(t, dM);
		},


		getNodeReaction(node, dir) {
			if (!this.isStable) return NaN;
			let q = this.qF.concat(this.qS);
			let d = this.getDOF(node, dir);
			if (d === null) return 0;
			if (q.length === 0) return NaN;
			return q[d.n];
		},

		getElementLength(elem) {
			let dx = elem.end.x - elem.start.x;
			let dy = elem.end.y - elem.start.y;
			return math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
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

		removeElementIncidence(elem) {
			let incStart = elem.start.incElements;	
			let incEnd = elem.end.incElements;
			for (let i = 0; i < incStart.length; i++) {
				if (incStart[i] === elem) incStart.splice(i, 1);
			}
			for (let j = 0; j < incEnd.length; j++) {
				if (incEnd[j] === elem) incEnd.splice(j, 1);
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

		expandNodes() {
			this.$refs.nodeRow.map(n => n.showOptions = true);
		},
		collapseNodes() {
			this.$refs.nodeRow.map(n => n.showOptions = false);
		},
		expandElems() {
			this.$refs.elemRow.map(n => n.showOptions = true);
		},
		collapseElems() {
			this.$refs.elemRow.map(n => n.showOptions = false);
		},

		
		removeAllNodes() {
			while (this.nodes.length > 0) {
				this.removeNodeByIndex(this.nodes, this.elements, 0);
			}
		},
		
		removeAllElems() {
			while (this.elements.length > 0) {
				this.removeElementByIndex(this.elements, 0);
			}
		},

		captureOn(evt) {
			this.captureToggle = true;
			this.panX = this.viewSettings.x - evt.x;
			this.panY = this.viewSettings.y - evt.y;
		},

		captureOff(evt) {
			this.captureToggle = false;
		},

		mo(evt) {
			if (this.captureToggle) {
				this.viewSettings.x = evt.x + this.panX;
				this.viewSettings.y = evt.y + this.panY;
			}
		},

	},
});	