window.onload = () => {
	console.log('main.js');

const data = {
	燃料: 1500,
	弾薬: 1500,
  鋼材: 2000,
  ボーキ: 1000,
  開発資材: 1,
  空きドック: 3,
  recipe: ''
};

const entries = [97,99,95,91];

const rate = (x, lower, upper) => {
  if (x >= upper) {
    return 1;
  } else if (x <= lower) {
    return 0;
  } else {
    return (x - lower) / (upper - lower);
  }
}

const vm = new Vue ({
  el: '#ogata',
  data: data,
  created() {
    console.log('Component created');
  },
  methods: {
    inputs() {
    	console.log('inputs');
      const values = this.recipe.split(/[^\d]+/);
    	console.log(values);
      if(values.length >= 4) {
	    	this['燃料'] = values[0] | 0
	    	this['弾薬'] = values[1] | 0
	    	this['鋼材'] = values[2] | 0
	    	this['ボーキ'] = values[3] | 0
	    }
    	if(values[4]) this['開発資材'] = values[4] | 0
    	if(values[5]) this['空きドック'] = values[5] | 0
    }
  },
  computed: {
    calc: function () {
    	const data = this;

    	let resource1 = 
    	Math.floor((data['燃料']-3000)*0.003)+
    	Math.floor((data['弾薬']-2000)*0.003)+
    	Math.floor((data['鋼材']-4000)*0.004)+
    	Math.floor((data['ボーキ']-5000)*0.005)+
    	Math.floor((data['開発資材']-50)*0.1);

    	if(resource1 < 0) resource1 = 0;

    	const r1 = 
      rate(data['燃料'], 2400, 3600) * 
      rate(data['弾薬'], 1050, 1950) * 
      rate(data['鋼材'], 2800, 4200) * 
      rate(data['ボーキ'], 2800, 5200);


    	let resource2 =  
    	Math.floor((data['燃料']-3500)*0.003)+
    	Math.floor((data['弾薬']-4500)*0.005)+
    	Math.floor((data['鋼材']-5500)*0.004)+
    	Math.floor((data['ボーキ']-2200)*0.002)+
    	Math.floor((data['開発資材']-50)*0.1);

    	if(resource2 < 0) resource2 = 0;

    	const r2 = data['開発資材'] < 20 ? 0 : (1 - r1) * 
      rate(data['燃料'], 2240, 3360) * 
      rate(data['弾薬'], 2940, 5460) * 
      rate(data['鋼材'], 4400, 6600) * 
      rate(data['ボーキ'], 1050, 1950);


    	let resource3 = 
    	Math.floor((data['燃料']-2500)*0.002)+
    	Math.floor((data['弾薬']-3000)*0.003)+
    	Math.floor((data['鋼材']-4000)*0.003)+
    	Math.floor((data['ボーキ']-1800)*0.002)+
    	Math.floor((data['開発資材']-50)*0.1);

    	if(resource3 < 0) resource3 = 0;

    	const r3 = (1 - r1 - r2) * 
      rate(data['燃料'], 1920, 2880) * 
      rate(data['弾薬'], 2240, 4160) * 
      rate(data['鋼材'], 3040, 4560) * 
      rate(data['ボーキ'], 910, 1690);


    	let resource4 = 
    	Math.floor((data['燃料']-2000)*0.002)+
    	Math.floor((data['弾薬']-2500)*0.003)+
    	Math.floor((data['鋼材']-3000)*0.002)+
    	Math.floor((data['ボーキ']-1500)*0.002)+
    	Math.floor((data['開発資材']-50)*0.1);

    	if(resource4 < 0) resource4 = 0;

    	const r4 = 1 - r1 - r2 - r3;

    	return [
    		[Math.round(r1 * 100), resource1],
    		[Math.round(r2 * 100), resource2],
    		[Math.round(r3 * 100), resource3],
    		[Math.round(r4 * 100), resource4],
    		entries[data['空きドック']]
    	];
    }
  }
});


};
