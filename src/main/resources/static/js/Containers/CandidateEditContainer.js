  var CandidateEditContainer = React.createClass({
	  getInitialState: function() {
		    return {
		      candidateDetails : [],
		      name : '',
		      surname : '',
		      birthdate : '',
		    };
		  },

		  componentWillMount: function() {
		    var self = this;
		    axios
		    .get('/candidate/' + this.props.params.id)
		    .then(function(response){
		      self.setState({
		        id : response.data.id,
		        name: response.data.name,
		      });
		    })
		    .catch(function(err){
		      console.error('CandidateEditContainer.componentWillMount.axios.get/admin/candidate/:id', err);
		    });
		  },

		  onHandleChangeName : function(event){
		    this.setState({name: event.target.value});
		  },

		  onHandleUpdate: function(event) {
		    var self = this;
		    axios
		    .put('/admin/candidate/' + self.state.id,
		      {
		        id : self.state.id,
		        name: self.state.name,})
		    .then(function(response){
		      console.log(response.data);
		      self.context.router.push('/admin/candidate');
		    })
		    .catch(function(err){
		      console.error('Update failed at CandidateEditContainer - ', err);
		    });
		    event.preventDefault();
		  },
		  onHandleCancel:function(){
		    this.context.router.push('/admin/candidate');
		  },

		  render: function() {
		    return (
		      <CandidateEditFormComponent
		      submitButtonName='Išsaugoti'
		      
		      onHandleChangeName={this.onHandleChangeName}

		      onHandleUpdate={this.onHandleUpdate}
		      onHandleCancel={this.onHandleCancel}

		      name={this.state.name}
		      />

		    );
		  }
		});

    CandidateEditContainer.contextTypes = {
	  router: React.PropTypes.object.isRequired,
	};
	
	window.CandidateEditContainer = CandidateEditContainer ;
