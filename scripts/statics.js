Vue.component('node-submission-row', {
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
		<tr>
			<td></td>
			<td>
				<input 
					type="text" 
					class="cell-input form-control form-control-sm" 
					v-model="newNodeX" 
					placeholder="X" 
					oninput="this.value = this.value.replace(/[^0-9.-]/g, '').replace(/(\\..*)\\./g, '$1')" 		
				/>
			</td>
			<td>
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
			<td></td>
		</tr>
	`
});

Vue.component('node-entry-row', {
	props: ['node', 'nodes'],
	data() {
		return {
			showOptions: false,
		};
	},
	computed: {
		optionsArrow () {
			if (this.showOptions) return "\u25B2";
			else return "\u25BC";
		}
	},
	template: `
		<tr>
		
			<td>
				<input class="cell-input form-control form-control-sm form-control-plaintext" 
						type="text" v-model="node.n"/>
			</td>
			<node-number-input :node="node" :input-value="'x'"></node-number-input>
			<node-number-input :node="node" :input-value="'y'"></node-number-input>
			<td class="cell-button">
				<button class="btn btn-outline-secondary options" type="button" 
						@click="showOptions=!showOptions">{{ optionsArrow }}</button>
				<button class="btn btn-outline-danger delete" type="button" 
						@click="$emit('remove')">&#x00d7;</button>
			</td>

			<td class="row-options" v-show="showOptions"></td>
			<node-number-input class="row-options" v-show="showOptions" :node="node" 
					:input-value="'loadX'"></node-number-input>
			<node-number-input class="row-options" v-show="showOptions" :node="node" 
					:input-value="'loadY'"></node-number-input>
			<td class="form-check row-options" v-show="showOptions">
				<input title="x-reaction" class="form-check-input" type="checkbox" 
						v-model="node.rx">
				<label title="x-reaction" class="form-check-label">X</label>
			</td>
			<td class="form-check row-options" v-show="showOptions">
				<input title="x-reaction" class="form-check-input" type="checkbox" 
						v-model="node.ry">
				<label title="y-reaction" class="form-check-label">Y</label>
			</td>

		</tr>
	`
});

Vue.component('node-number-input', {
	props: ['node', 'inputValue'],
	data() {
		return {
			showSpinner: false,
			step: 1,
		};
	},
	template: `
		<td>
			<div class="input-group input-group-sm" 
					@mouseover="showSpinner=true"	@mouseleave="showSpinner=false">
				<input 
					type="number" 
					step=any
					class="no-spin cell-input form-control form-control-sm" 
					v-model.number="node[inputValue]"
					@focus="$event.target.select()"
				/>
				<div v-show="showSpinner" class="input-group-append btn-spinner">
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

Vue.component('checkbox-input', {
	props: ['object', 'setting', 'id', 'label'],
	template: `
		<div class="form-check form-check-inline">
			<input class="form-check-input" type="checkbox" :id="id" v-model="object[setting]">
			<label class="form-check-label" :for="id">{{ label }}</label>
		</div>
	`
});

Vue.component('node-circle', {
	props: ['node', 'view'],
	computed: {
		x () {
			if (this.node.x === "") {
				return 0;
			}
			return this.node.x * this.view.scale;
		},
		y () {
			if (this.node.y === "") {
				return 0;
			}
			return this.node.y * this.view.scale;
		},
		fX () {
			if (this.node.loadX === "") {
				return 0;
			}
			return this.node.loadX;
		},
		fY () {
			if (this.node.loadY === "") {
				return 0;
			}
			return this.node.loadY;
		},
		d () {
			result = math.sqrt(Math.pow(this.fX, 2) + Math.pow(this.fY, 2));
			if (result === 0) {
				return 1;
			}
			return result;
		},
		dRounded() {
			return math.round(this.d, 2);
		},
		reactionXTriangle() {		
			return (this.view.x - 5 + this.x) + ',' + (this.view.y - this.y) + ' ' 
					+ (this.view.x - 13 + this.x) + ',' + (this.view.y - 8 - this.y) + ' ' 
					+ (this.view.x - 13 + this.x) + ',' + (this.view.y + 8 - this.y);
		},
		reactionYTriangle() {
			return (this.view.x + this.x) + ',' + (this.view.y + 5 - this.y) + ' ' 
					+ (this.view.x + 8 + this.x) + ',' + (this.view.y + 13 - this.y) + ' ' 
					+ (this.view.x - 8 + this.x) + ',' + (this.view.y + 13 - this.y);
		},
		forcePathDefinition() {
			return 'M' + (this.view.x + this.x - 50 * this.fX / this.d) + ','
					+ (this.view.y - this.y + 50 * this.fY / this.d) + 'L' 
					+ (this.view.x + this.x - 10 * this.fX / this.d) + ',' 
					+ (this.view.y - this.y + 10 * this.fY / this.d);
		}
	},
	template: `
		<svg>
			<defs>
				<marker id='head' orient="auto"
					markerWidth='2' markerHeight='4'
					refX='0.1' refY='2'>
					<path d='M0,0 V4 L2,2 Z' fill="black"/>
				</marker>
			</defs>
			<circle 
				class="circle-node"
				:cx="this.view.x + this.x" 
				:cy="this.view.y - this.y" 
				r="1.5" 
			></circle>
			<text 
				v-show="view.nodeLabels""
				:x="this.view.x + 5 + this.x" 
				:y="this.view.y + 10 - this.y" 
			>{{ node.n }}</text>
			<path 
				class="path-force"
				v-show="view.appliedForces && (this.fY !== 0 || this.fX !== 0)"
				:d="forcePathDefinition" 
			></path>
			<text 
				v-show="view.appliedForces && (this.fY !== 0 || this.fX !== 0)" 
				:x="(this.view.x + this.x - 55 * this.fX / this.d)" 
				:y="(this.view.y - this.y + 55 * this.fY / this.d)"
				text-anchor="middle"
			>{{ this.dRounded }}</text>
			<polygon class="triangle-support" v-show="node.rx && view.supports" 
					:points="reactionXTriangle"></polygon>
			<polygon class="triangle-support" v-show="node.ry && view.supports" 
					:points="reactionYTriangle"></polygon>
		</svg>
	`
});

Vue.component('member-submission-row', {
	props: ['members', 'nodes'],
	data() {
		return {
			newStart: '',
			newEnd: '',
		}		
	},
	methods: {
		submitMember() {
			this.$emit('submit-member', this.newStart, this.newEnd)
			this.newStart = ''
			this.newEnd = ''
		},
	},
	template: `
		<tr>
			<td></td>
			<td>
				<select class="cell-input form-control form-control-sm" 
						placeholder="#" v-model="newStart">
					<option selected disabled hidden value="">N1</option>	
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td>
				<select class="cell-input form-control form-control-sm" v-model="newEnd" 
						@keyup.enter="submitMember">
					<option selected disabled hidden value="">N2</option>		
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td class="cell-button"><button 
				type="button" 
				class="btn btn-outline-success submit" 
				@click="submitMember" 
			>+</button></td>
			<td></td>
		</tr>
	`
});

Vue.component('member-entry', {
	props: ['member', 'nodes'],
	data() {
		return {
			showOptions: false,
		};
	},
	computed: {
		arrowSymbol () {
			if (this.showOptions) {
				return "\u25B2";
			} else {
				return "\u25BC";
			}
		},
		dX () {
			return this.member.end.x - this.member.start.x;
		},
		dY () {
			return this.member.end.y - this.member.start.y;
		},
		length () {
			return math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2));
		},
	},
	template: `
		<tr>
			<td>
				<input class="cell-input form-control form-control-sm form-control-plaintext" 
						type="text" v-model="member.n"/>
			</td>
			<td>
				<select class="cell-input form-control form-control-sm" v-model="member.start">
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td>
				<select class="cell-input form-control form-control-sm" v-model="member.end">
					<option v-for="node in nodes" :value="node">{{ node.n }}</option>
				</select>
			</td>
			<td class="cell-button">
				<button type="button" class="btn btn-outline-secondary options" 
						@click="showOptions=!showOptions">{{ arrowSymbol }}</button>
				<button type="button" class="btn btn-outline-danger delete"
						 @click="$emit(\'remove\')">&#x00d7;</button>
			</td>
			<td class="row-options" v-show="showOptions"></td>
			<node-number-input class="row-options" title="elastic modulus, E" 
					v-show="showOptions" :node="member" :input-value="'e'"></node-number-input>
			<node-number-input class="row-options" title="area, A" 
					v-show="showOptions" :node="member" :input-value="'a'"></node-number-input>
			<td class="form-check row-options" v-show="showOptions">
				<input title="x-reaction" class="form-check-input" type="checkbox" 
						v-model="member.startFix">
				<label title="x-reaction" class="form-check-label">X</label>
			</td>
			<td class="form-check row-options" v-show="showOptions">
				<input title="x-reaction" class="form-check-input" type="checkbox" 
						v-model="member.endFix">
				<label title="y-reaction" class="form-check-label">Y</label>
			</td>
		</tr>
	`
});

Vue.component('member-path', {
	props: ['member', 'member-force', 'view'],
	computed: {
		memberPathDefinition() {
			return 'M' + (this.view.x + this.view.scale * this.member.start.x) + ','
					+ (this.view.y - this.view.scale * this.member.start.y) + 'L' 
					+ (this.view.x + this.view.scale * this.member.end.x) + ',' 
					+ (this.view.y - this.view.scale * this.member.end.y);
		},
		forceRounded () {
			return math.round(this.memberForce, 2);
		},	
		topSide () {
			if (this.member.start.x < this.member.end.x) {
				return "left";
			} else {
				return "right";
			}
		},
	},
	template: `
		<svg>
			<path 
				:id="'path' + member.id"
				class="path-member"
				:d="memberPathDefinition" 				
			></path>
			<text v-show="view.memberForces">
				<textPath :href="'#path' + member.id" startOffset="50%" text-anchor="middle" :side="topSide">
					<tspan dy="-0.25em">{{ this.forceRounded }}</tspan>
				</textPath>
			</text>
		</svg>
	`
});

let app = new Vue({
	el: '#app',
	data: {
		isMounted: false,
		nodes: [],
		members: [],
		nextUniqueId: 1,
		nextMemberId: -1,
		viewSettings: {
			appliedForces: true,
			axes: true,
			display: false,
			memberForces: true,
			nodeLabels: true,
			x: 256,
			y: 200,
			scale: 30,
			supports: true,
		},
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
			let degrees = [];
			for (let i = 0; i < this.nodes.length; i++) {
				if (!this.nodes[i].rx) {
					degrees.push({
						n: n++,
						node: this.nodes[i],
						force: this.nodes[i].loadX,
						dir: "x",
						support: false
					});
				}
				if (!this.nodes[i].ry) {
					degrees.push({
						n: n++,
						node: this.nodes[i],
						force: this.nodes[i].loadY,
						dir: "y",
						support: false
					});
				}
			}
			for (let i = 0; i < this.nodes.length; i++) {
				if (this.nodes[i].rx) {
					degrees.push({
						n: n++,
						node: this.nodes[i],
						force: this.nodes[i].loadX,
						dir: "x",
						support: true
					});
				}
				if (this.nodes[i].ry) {
					degrees.push({
						n: n++,
						node: this.nodes[i],
						force: this.nodes[i].loadY,
						dir: "y",
						support: true
					});
				}
			}
			return degrees;
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
			let d = [];
			for (let i = 0; i < this.numDegreesF; i++) {
				d.push(i);
			}
			return d;
		},
		degreesS () {
			let d = [];
			for (let i = this.numDegreesF; i < this.dof.length; i++) {
				d.push(i);
			}
			return d;
		},

		k () {
			let n  = this.nodes.length * 2;
			let k = arr = Array(n).fill().map(() => Array(n).fill(0));
			for (let i = 0; i < this.members.length; i++) {
				let m = this.members[i];

				let dx = parseFloat(m.end.x) - parseFloat(m.start.x);
				let dy = parseFloat(m.end.y) - parseFloat(m.start.y);
				let l = math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

				let t = [[dx/l, dy/l, 0, 0], [0, 0, dx/l, dy/l]];
				let kLocal = math.multiply([[1, -1],[-1, 1]], m.e * m.a / l);
				let kGlobal = math.multiply(math.transpose(t), kLocal, t);

				let nx = this.getDOFNumber(m.start, "x");	
				let ny = this.getDOFNumber(m.start, "y");	
				let fx = this.getDOFNumber(m.end, "x");	
				let fy = this.getDOFNumber(m.end, "y");	

				k[nx][nx] += kGlobal[0][0];
				k[nx][ny] += kGlobal[0][1];
				k[nx][fx] += kGlobal[0][2];
				k[nx][fy] += kGlobal[0][3];
				
				k[ny][nx] += kGlobal[1][0];
				k[ny][ny] += kGlobal[1][1];
				k[ny][fx] += kGlobal[1][2];
				k[ny][fy] += kGlobal[1][3];

				k[fx][nx] += kGlobal[2][0];
				k[fx][ny] += kGlobal[2][1];
				k[fx][fx] += kGlobal[2][2];
				k[fx][fy] += kGlobal[2][3];

				k[fy][nx] += kGlobal[3][0];
				k[fy][ny] += kGlobal[3][1];
				k[fy][fx] += kGlobal[3][2];
				k[fy][fy] += kGlobal[3][3];
			}
			return k;
		},

		kFF () {
			return math.subset(this.k, math.index(this.degreesF, this.degreesF));
		},
		kSF () {
			return math.subset(this.k, math.index(this.degreesS, this.degreesF));
		},
		kSS () {
			return math.subset(this.k, math.index(this.degreesS, this.degreesS));
		},

		qF () {
			let vec = [];
			for (let i = 0; i < this.numDegreesF; i++) {
				vec.push(this.dof[i].force);
			}
			return vec;
		},

		/* Each support has a displacement of 0.
		*/
		dS () {
			let vec = [];
			for (let i = this.numDegreesF; i < this.dof.length; i++) {
				vec.push(0);
			}
			return vec;
		},
		
		/* Calculated displacements for unrestrained degrees of freedom.
		*/
		dF () {
			if (math.det(this.kFF) === 0) {
				return [];
			}
			return math.multiply(math.inv(this.kFF), math.transpose(this.qF));
		},

		qS () {
			return math.multiply(this.kSF, math.transpose(this.dF));
		},

		memberForces () {
			let m = [];
			for (let i = 0; i < this.members.length; i++) {
				m.push(this.getMemberForce(this.members[i]));
			}
			return m;
		},

		isStaticallyDeterminate () {
			return (this.members.length + this.nReactions === 2 * this.nodes.length);
		},
	},
	mounted: function () {
		this.isMounted = true;
		this.addNode(4, 0, 0, -2);
		this.addNode(0, 3, 0, 0, true, true);
		this.addNode(0, 0, 0, 0, true, true);
		this.addNode(0, -3, 0, 0, true, true);
		this.addMember(this.nodes[0], this.nodes[1]);
		this.addMember(this.nodes[0], this.nodes[2]);
		this.addMember(this.nodes[0], this.nodes[3]);
		this.canvasW = this.getCanvasWidth();
		this.canvasH = this.getCanvasHeight();
		this.viewSettings.x = this.canvasW / 2;
		this.viewSettings.y = this.canvasH / 2;
	},
	updated() {
		this.$nextTick(function () {
			this.canvasW = math.round(this.$refs.canvas.width.baseVal.value, 2);
			this.canvasH = math.round(this.$refs.canvas.height.baseVal.value, 2);
		});
	},
	methods: {

		getCanvasWidth () {
			return parseFloat(window.getComputedStyle(this.$refs.canvas)["width"])
		},
		getCanvasHeight () {
			return parseFloat(window.getComputedStyle(this.$refs.canvas)["height"])
		},

		addNode(x = 0, y = 0, qx = 0, qy = 0, rx = false, ry = false) {
			this.nodes.push({ 
				id: this.nextUniqueId++,
				n: this.nodes.length + 1,
				x: x === '' ? 0 : x,
				y: y === '' ? 0 : y,
				loadX: qx,
				loadY: qy,
				rx: rx,
				ry: ry,		
				incMembers: [], 
			});
		},

		addMember(start, end, e = 1, a = 1) {
			if (start !== "" && end !== "") {
				let newMember = {
					id: this.nextMemberId--,
					n: this.members.length + 1,
					start: start,
					end: end,
					startFix: true,
					endFix: true,
					e: e,
					a: a,
				}
				this.members.push(newMember);
				start.incMembers.push(newMember);
				end.incMembers.push(newMember);
			}
		},

		getDOFNumber (node, dir) {
			for (let i = 0; i < this.dof.length; i++) {
				let deg = this.dof[i];
				if (deg.node === node && deg.dir === dir) {
					return deg.n;
				}
			}
		},

		/* Returns the axial force in a member.
		 */
		getMemberForce(member) {
			let dx = parseFloat(member.end.x) - parseFloat(member.start.x);
			let dy = parseFloat(member.end.y) - parseFloat(member.start.y);
			let l = math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

			let t = [dx/l, dy/l, -dx/l, -dy/l];

			let d = math.concat(this.dF, this.dS, 0);

			let dM = [
				d[this.getDOFNumber(member.start, "x")], 
				d[this.getDOFNumber(member.start, "y")],
				d[this.getDOFNumber(member.end, "x")], 
				d[this.getDOFNumber(member.end, "y")]
			];
			if (this.dF.length === 0) {
				return NaN;
			}
			return -(member.e * member.a / l) * math.dot(t, dM);
		},

		removeNode(nodeArr, memberArr, node) {
			index = 0;
			for (let i = 0; i < nodeArr.length; i++) {
				if (nodeArr[i] === node) {
					index = i;
				}
			}
			this.removeNodeByIndex(nodeArr, memberArr, index);			
		},

		removeNodeByIndex(nodeArr, memberArr, index) {
			for (let i = 0; i < memberArr.length; i++) {
				if (memberArr[i].start.n === nodeArr[index].n || 
							memberArr[i].end.n === nodeArr[index].n) {
					this.removeMemberByIndex(memberArr, i);
					i--;
				}
			}
			nodeArr.splice(index, 1);
		},

		removeNodeOnly(nodeArr, index) {
			nodeArr.splice(index, 1);
		},

		removeMemberIncidence(member) {
			let incStart = member.start.incMembers;	
			let incEnd = member.end.incMembers;
			for (let i = 0; i < incStart.length; i++) {
				if (incStart[i] === member) {
					incStart.splice(i, 1);
				}
			}
			for (let j = 0; j < incEnd.length; j++) {
				if (incEnd[j] === member) {
					incEnd.splice(j, 1);
				}
			}
		},

		removeMemberByIndex(memberArr, index) {
			let incStart = memberArr[index].start.incMembers;	
			let incEnd = memberArr[index].end.incMembers;
			for (let i = 0; i < incStart.length; i++) {
				if (incStart[i] === memberArr[index]) {
					incStart.splice(i, 1);
				}
			}
			for (let j = 0; j < incEnd.length; j++) {
				if (incEnd[j] === memberArr[index]) {
					incEnd.splice(j, 1);
				}
			}
			memberArr.splice(index, 1);
		},	
		
		isSimple() {
			let nodes = _.cloneDeep(this.nodes);
			for (let i = 0; i < nodes.length; i++) {
				if (nodes[i].incMembers.length === 2) {
					this.removeMemberIncidence(nodes[i].incMembers[1]);
					this.removeMemberIncidence(nodes[i].incMembers[0]);
					this.removeNodeOnly(nodes, i);
					i = 0;
				}
			}
			if (nodes.length === 2 && nodes[0].incMembers.length === 1) {
				return true;
			}
			return false;
		},

		containsTriangle () {
			for (let i = 0; i < this.members.length; i++) {
				let s = this.members[i].start;
				let e = this.members[i].end;	
				for (let j = 0; j < this.nodes.length; j++) {
					let n = this.nodes[j];	
					let hasStartLeg = false;
					let hasEndLeg = false;
					for (let k = 0; k < n.incMembers.length; k++) {
						let m = n.incMembers[k];		
						if ((m.start === n && m.end === s) || (m.start === s && m.end === n)) {
							hasStartLeg = true;
						}
						if ((m.start === n && m.end == e) || (m.start === e && m.end === n)) {
							hasEndLeg = true;
						}
					}					
					if (hasStartLeg && hasEndLeg) {
						return true;
					}
				}
			}
			return false;
		},
	}
});	