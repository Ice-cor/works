!(function() {
  var picker = {
    $data: null,
    province_selected: undefined,
    city_selected: undefined,
    name_selected: undefined,
    init: function() {
      this.$data = {}
      this.province_selected = '天津市'
      this.city_selected = '天津市'
      this.name_selected = '中国长安汽车集团天津销售有限公司河西分公司'
      this.tools.translation.call(this,$city) //转译数据源 $city为数据源
      this.tools.createOptions_select1.call(this)

      this.bindEvents.call(this)
    },
    bindEvents: function() {
      this.$S('#select1').addEventListener('change', function(e) {
        this.province_selected = e.target.value
        this.city_selected = Object.keys(
          this.$data[this.province_selected]
        )[0].toString() //默认第一个值
        this.name_selected = Object.keys(
          this.$data[this.province_selected][this.city_selected]
        )[0].toString() //默认第一个值
          console.log(this.province_selected)
          console.log(this.city_selected)
          console.log(this.name_selected)
        this.tools.createOptions_select2.call(this)
      }.bind(this))

      this.$S('#select2').addEventListener('change', function(e) {
        this.city_selected = e.target.value
        name_selected = Object.keys(
          this.$data[this.province_selected][this.city_selected]
        )[0]
        //   console.log(city_selected,name_selected)
        this.tools.createOptions_select3.call(this)
      }.bind(this))
      this.$S('#select3').addEventListener('change', function(e) {
        this.name_selected = e.target.value
      }.bind(this))
    },
    tools: {
      createOptions_select1: function() {
        Object.keys(this.$data).forEach(function(key) {
          this.tools.createOptions.call(this,key, key, '#select1')
        }.bind(this))
        this.tools.createOptions_select2.call(this)
      },
      createOptions_select2: function() {
        this.$S('#select2').innerHTML = ''
        Object.keys(this.$data[this.province_selected]).forEach(function(key) {
          this.tools.createOptions.call(this,key, key, '#select2')
        }.bind(this))
        this.tools.createOptions_select3.call(this)
      },
      createOptions_select3: function() {
        this.$S('#select3').innerHTML = ''
        Object.keys(this.$data[this.province_selected][this.city_selected]).forEach(
          function(key) {
            this.tools.createOptions.call(this,key, key, '#select3')
          }.bind(this)
        )
      },
      createOptions: function(text, value, name) {
        var option = document.createElement('option')
        option.textContent = text
        option.value = value

        this.$S(name).appendChild(option)
      },
      translation: function(data) {
        //data => array 传入值为数据源
        data.forEach(function(e) {
          this.$data[e.province] = this.$data[e.province] || {}
          this.$data[e.province][e.city] = this.$data[e.province][e.city] || {}
          this.$data[e.province][e.city][e.name] = { id: e.id }
        }.bind(this))
      }
    },
    $S: function(name) {
      return document.querySelector(name)
    }
  }
  picker.init()
})()
