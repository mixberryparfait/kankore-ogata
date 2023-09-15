//document.addEventListener('DOMContentLoaded', () => {
window.addEventListener('load', () => {
  console.log('main.js');

const data = {
  燃料: 1500,
  弾薬: 1500,
  鋼材: 2000,
  ボーキ: 1000,
  開発資材: 1,
  空きドック: 3,
  recipe: '',
  ship_change: false,
  memos: ['3360/5460/6600/1950/20/3', '6840/6900/7000/2700/20/3', '2880/4160/4560/1690/1/3', '7000/7000/7000/2300/1/3']
};

const rate = (x, lower, upper) => {
  if (x >= upper) {
    return 1;
  } else if (x <= lower) {
    return 0;
  } else {
    return (x - lower + 1) / (upper - lower); // 下限値から確率発生
  }
}


const calc = () => {
  console.log('calc');

  // レシピセット

  data['recipe'] = `${data['燃料']}/${data['弾薬']}/${data['鋼材']}/${data['ボーキ']}/${data['開発資材']}/${data['空きドック']}`;

  if(localStorage) {
    localStorage.setItem('recipe', data['recipe']);
  }


  // テーブル確率

  const table_rate = [0,0,0,0];

  table_rate[0] = 
  rate(data['燃料'], 2400, 3600) * 
  rate(data['弾薬'], 1050, 1950) * 
  rate(data['鋼材'], 2800, 4200) * 
  rate(data['ボーキ'], 2800, 5200);

  table_rate[1] = data['開発資材'] < 20 ? 0 : (1 - table_rate[0]) * 
  rate(data['燃料'], 2240, 3360) * 
  rate(data['弾薬'], 2940, 5460) * 
  rate(data['鋼材'], 4400, 6600) * 
  rate(data['ボーキ'], 1050, 1950);

  table_rate[2] = (1 - table_rate[0] - table_rate[1]) * 
  rate(data['燃料'], 1920, 2880) * 
  rate(data['弾薬'], 2240, 4160) * 
  rate(data['鋼材'], 3040, 4560) * 
  rate(data['ボーキ'], 910, 1690);

  table_rate[3] = 1 - table_rate[0] - table_rate[1] - table_rate[2];

  displayChart(table_rate);

  //　資源定数

  const resource_factors = [
    [ // group_id == 1
      [3000, 0.003], // fuel
      [2000, 0.003], // bull
      [4000, 0.004], // steel
      [5000, 0.005], // bauxite
      [50, 0.1]      // devkit
    ],
    [ // group_id == 2
      [3500, 0.003], // fuel
      [4500, 0.005], // bull
      [5500, 0.004], // steel
      [2200, 0.002], // bauxite
      [60, 0.2]      // devkit
    ],
    [ // group_id == 3
      [2500, 0.002], // fuel
      [3000, 0.003], // bull
      [4000, 0.003], // steel
      [1800, 0.002], // bauxite
      [40, 0.2]      // devkit
    ],
    [ // group_id == 4
      [2000, 0.002], // fuel
      [2500, 0.003], // bull
      [3000, 0.002], // steel
      [1500, 0.002], // bauxite
      [40, 0.2]      // devkit
    ]
  ];

  const ranges = [
    [3,100],
    [1,100],
    [1,96],
    [1,92]
  ];

  const skips = [0,0,0,0];

  const results = {};

  for(let t = 0; t < 4; t++) {
    if(table_rate[t] <= 0) continue;

    // 資源定数

    let num8 = 0;
    ['燃料', '弾薬', '鋼材', 'ボーキ', '開発資材'].forEach((e, i) => {
      num8 += Math.floor((data[e] - resource_factors[t][i][0]) * resource_factors[t][i][1]);
    });
    if(num8 < 0) num8 = 0;
    skips[t] = num8;
    if(num8 <= 0) num8 = 1;

    //////////

    const range = ranges[data['空きドック']];
    const entry_count = range[1] - range[0];

    for(let num2 = range[0]; num2 < range[1]; num2++) {
      for(let i = 0; i < num8; i++) {
        const num9 = i > 50 ? 50 : i;
        let num10 = num2 - num9;
        if (num10 < 1) {
            num10 = 2 - num10;
        }

        const ship = (data.ship_change && t == 1 && [1,2,4,6,13,27,28].includes(num10)) ? 'Bismarck' : table_data[t][num10];

        if(!results[ship]) results[ship] = 0;
        results[ship] += table_rate[t] / entry_count / num8;
      }
    }
  }

  return [
    [(table_rate[0] * 100).toFixed(2), skips[0]],
    [(table_rate[1] * 100).toFixed(2), skips[1]],
    [(table_rate[2] * 100).toFixed(2), skips[2]],
    [(table_rate[3] * 100).toFixed(2), skips[3]],
    ranges[data['空きドック']],
    Object.entries(results).map(e => [
      e[0], 
      (e[1] * 100).toFixed(2) + ' %', 
      data['燃料'] / e[1]| 0,
      data['弾薬'] / e[1] | 0,
      data['鋼材'] / e[1] | 0,
      data['ボーキ'] / e[1] | 0,
      data['開発資材'] / e[1] | 0,
    ])
  ];
}

  /////////////////////////////////////////

const displayChart = (r) => {
  var chartDom = document.getElementById('table_chart');
  var myChart = echarts.init(chartDom);
  var option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        data: [
          { value: r[0], name: '空母' },
          { value: r[1], name: '武蔵' },
          { value: r[2], name: '大和' },
          { value: r[3], name: '矢矧' },
        ],
      }
    ]
  };
  myChart.setOption(option);
}

  /////////////////////////////////////////

const vm = new Vue ({
  el: '#ogata',
  data: data,
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
    },

    adjust(key, val) {
      this[key] += val | 0;

      if(this['燃料'] > 7000) this['燃料'] = 7000;
      else if(this['燃料'] < 1500) this['燃料'] = 1500;
      if(this['弾薬'] > 7000) this['弾薬'] = 7000;
      else if(this['弾薬'] < 1500) this['弾薬'] = 1500;
      if(this['鋼材'] > 7000) this['鋼材'] = 7000;
      else if(this['鋼材'] < 2000) this['鋼材'] = 2000;
      if(this['ボーキ'] > 7000) this['ボーキ'] = 7000;
      else if(this['ボーキ'] < 1000) this['ボーキ'] = 1000;
    },

    addMemo() {
      if (this.recipe.trim() !== "") {
        this.memos.push(this.recipe);
        this.saveMemo();
      }
    },

    removeMemo(index) {
      // メモのリストから特定のメモを削除
      this.memos.splice(index, 1);
      this.saveMemo();
    },

    saveMemo() {
      if(localStorage) {  
        localStorage.setItem('recipe_memo', this.memos.join(','));
      } 
    },

    setMemoToInput(memo) {
      // メモ内容を入力欄にセット
      this.recipe = memo;
      this.inputs()
    }
  },

  mounted() {
    calc();
  },

  created() {
    try {
      if(localStorage) {
        let recipe; 
        if(recipe = localStorage.getItem('recipe')) {
          this.recipe = recipe; 
          this.inputs();
        }
        let memos;
        if(memos = localStorage.getItem('recipe_memo')) {
          this.memos = memos.split(',');
        }
      }
    } catch(e) {
      console.log(e);
    }
  },

  computed: {
    calc: calc
  }
});

});