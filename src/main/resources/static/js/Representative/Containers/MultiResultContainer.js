function getParties(self) {
  axios
    .get('/party')
    .then(function(response){
      self.setState({
        partyList :  response.data,
      });
    })
    .catch(function(err){
      console.error('MultiResultContainer.componentWillMount.axios.get.party', err);
    });
}
function getDistrict(self,id) {
  axios
    .get('/district/' + id)
    .then(function(response){
      self.setState({
        districtInfo :  response.data,
        isLoading : false,
      });
      if (response.data.resultMultiRegistered) {
        self.setState({isVotesRegistered : true});
      }
    })
    .catch(function(err){
      console.error('MultiResultContainer.componentWillMount.axios.get.district', err);
    });
}
function isCountEqualsOrLess(list,max){
  var count = 0;
  for (var key1 in list) {
    if (list.hasOwnProperty(key1)) {
      count = count + parseInt(list[key1]);
    }
  }
  if (count > max) {
    return false;
  } else {
    return true;
  }
}
var errorMesages = [];
var list = {};
var postArray =[];
var MultiResultContainer = React.createClass({
  getInitialState: function() {
    return {
      partyList: [],
      districtId : 5,
      districtInfo : [],
      isVotesRegistered : false,
      isLoading : true,
      errorMesages : [],
    };
  },
  componentWillMount: function() {
    getParties(this);
    getDistrict(this,this.state.districtId);

  },
  registerVotes : function(id,votes){
    list[id]=votes;
  },
  onHandleSpoiledChange : function(event){
    list[-1991]=event.target.value;
  },
  onHandleSubmit : function(event) {
    event.preventDefault();
    errorMesages = [];
    this.setState({errorMesages : []});
    if (!isCountEqualsOrLess(list, this.state.districtInfo.numberOfElectors)) {
      errorMesages.push('Apygarda ' + this.state.districtInfo.name + ' turi tik ' +  this.state.districtInfo.numberOfElectors + ' balsų.');
      this.setState({errorMesages : errorMesages});
    } else {
      for (var key in list) {
        if (list.hasOwnProperty(key)) {
          var self = this;
          postArray.push(
            {
              'party' : {'id' : key},
              'district' : {'id' : this.state.districtId},
              'votes' : list[key],
              'datePublished' : new Date(),
            }
          );
        }
      }
      axios
      .post('/result-multi', postArray)
      .then(function(response){
        self.setState({isVotesRegistered : true});
      })
      .catch(function(err){
        console.error('MultiResultContainer.onHandleSubmit.axios',err);
      });
    }
  },

  render: function() {
    if (this.state.isLoading) {
      return <div><img src='/images/loading.gif'/></div>;
    }
    if (this.state.isVotesRegistered) {
      return(
        <div>
          {alerts.showSucces('Jūsų apylinkės balsai užregistruoti')}
        </div>
      );
    } else {
      return (
        <MultiResultComponent
        list = {this.state.partyList}
        onNumberChange={this.onNumberChange}
        registerVotes={this.registerVotes}
        onHandleSubmit={this.onHandleSubmit}
        onHandleSpoiledChange={this.onHandleSpoiledChange}
        errorMesages={this.state.errorMesages}
        />
      );
    }
  }

});

window.MultiResultContainer = MultiResultContainer;