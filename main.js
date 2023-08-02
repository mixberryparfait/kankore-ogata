
window.onload = () => {
  console.log('main.js');

const data = {
	燃料: 1500,
	弾薬: 1500,
  鋼材: 2000,
  ボーキ: 1000,
  開発資材: 1,
  空きドック: 3,
  recipe: '',
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
      const values = this.recipe.split(/[^\d]+/);
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

      data['recipe'] = `${data['燃料']}/${data['弾薬']}/${data['鋼材']}/${data['ボーキ']}/${data['開発資材']}`

      const n = [0,0,0,0]
      const r = [0,0,0,0]

    	n[0] = 
    	Math.floor((data['燃料']-3000)*0.003)+
    	Math.floor((data['弾薬']-2000)*0.003)+
    	Math.floor((data['鋼材']-4000)*0.004)+
    	Math.floor((data['ボーキ']-5000)*0.005)+
    	Math.floor((data['開発資材']-50)*0.1);

    	if(n[0] < 0) n[0] = 0;

    	r[0] = 
      rate(data['燃料'], 2400, 3600) * 
      rate(data['弾薬'], 1050, 1950) * 
      rate(data['鋼材'], 2800, 4200) * 
      rate(data['ボーキ'], 2800, 5200);


    	n[1] =  
    	Math.floor((data['燃料']-3500)*0.003)+
    	Math.floor((data['弾薬']-4500)*0.005)+
    	Math.floor((data['鋼材']-5500)*0.004)+
    	Math.floor((data['ボーキ']-2200)*0.002)+
    	Math.floor((data['開発資材']-60)*0.2);

    	if(n[1] < 0) n[1] = 0;

    	r[1] = data['開発資材'] < 20 ? 0 : (1 - r[0]) * 
      rate(data['燃料'], 2240, 3360) * 
      rate(data['弾薬'], 2940, 5460) * 
      rate(data['鋼材'], 4400, 6600) * 
      rate(data['ボーキ'], 1050, 1950);


    	n[2] = 
    	Math.floor((data['燃料']-2500)*0.002)+
    	Math.floor((data['弾薬']-3000)*0.003)+
    	Math.floor((data['鋼材']-4000)*0.003)+
    	Math.floor((data['ボーキ']-1800)*0.002)+
    	Math.floor((data['開発資材']-40)*0.2);

    	if(n[2] < 0) n[2] = 0;

    	r[2] = (1 - r[0] - r[1]) * 
      rate(data['燃料'], 1920, 2880) * 
      rate(data['弾薬'], 2240, 4160) * 
      rate(data['鋼材'], 3040, 4560) * 
      rate(data['ボーキ'], 910, 1690);


    	n[3] = 
    	Math.floor((data['燃料']-2000)*0.002)+
    	Math.floor((data['弾薬']-2500)*0.003)+
    	Math.floor((data['鋼材']-3000)*0.002)+
    	Math.floor((data['ボーキ']-1500)*0.002)+
    	Math.floor((data['開発資材']-40)*0.2);

    	if(n[3] < 0) n[3] = 0;

    	r[3] = 1 - r[0] - r[1] - r[2];

      /////////////////////

      // m: エントリ　n: 資源定数  i:エントリINDEX
      const hits = (m, n, i) => {
        if(i == 0) return n;
        if(i <= n) return 2 * n - i + 1;
        if(i >= m - n) return m - i;
        return n + 1;
      }

      const results = {}

      // r: テーブル率
      const count_ships = (m, n, r, t) => {
        const sum = m * (n + 1);
        for(let i = 0; i < m; i++) {
          //console.log(m + ' ' + n + ' ' + i + ' ' + hits(m,n,i))
          if(results[t[i]])
            results[t[i]] += hits(m,n,i) * r / sum;
          else
            results[t[i]] = hits(m,n,i) * r / sum;
        }
      }

      for(let t = 0; t < 4; t++) {
        if(r[t] > 0)
          count_ships(entries[data['空きドック']], n[t], r[t], table_data[t])
      }

    	return [
    		[(r[0] * 100).toFixed(2), n[0]],
    		[(r[1] * 100).toFixed(2), n[1]],
    		[(r[2] * 100).toFixed(2), n[2]],
    		[(r[3] * 100).toFixed(2), n[3]],
    		entries[data['空きドック']],
        Object.entries(results).map(e => {e[1] = (e[1] * 100).toFixed(2) + ' %'; return e;})
    	];
    }
  }
});


};
