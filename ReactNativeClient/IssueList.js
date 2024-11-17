import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
    TouchableOpacity,
    Alert,
  } from 'react-native';

import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <Text style={styles.headerText}>This is IssueFilter</Text>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: 'black' },
  headerText: { paddingTop: 10, justifyContent: 'space-around', textAlign: 'center', color: '#35ABF0', color: '#35ABF0', fontSize: 20, fontWeight: 'bold'},
  text: { textAlign: 'center', color: 'white' },
  dataWrapper: { marginTop: -1 },
  scroller: { flexDirection: 'row', alignContent: 'center', width: '100%'},
  nav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'},
  table: { textAlign: 'center', justifyContent: 'space-around', backgroundColor: '#35ABF0', flexDirection: 'row' },
  cell: { justifyContent: 'space-around', alignItems: 'center', textAlign: 'center', color: 'white', borderWidth: 1, borderColor: 'grey', paddingTop: 5 },
  formText: { justifyContent: 'space-around', width: 100, textAlign: 'center', color: '#35ABF0', fontSize: 20, fontWeight: 'bold', marginRight: 10},
  form: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { height: 40, width: 200, borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 8, marginVertical: 5 },
  pickerContainer: { justifyContent: 'space-around', height: 40, width: 200, textAlign: 'center', borderColor: 'gray', borderWidth: 1, borderRadius: 5, paddingLeft: 8, marginVertical: 5 },
  });

//const width= [40,80,80,80,80,80,200];
const width = [40, 200, 80, 80, 80, 50, 80];

function IssueRow(props) {
    const issue = props.issue;
    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const row = [
      issue.id,
      issue.title,
      issue.status,
      issue.owner,
      issue.created.toLocaleDateString('en-CA'),
      issue.effort,
      issue.due ? new Date(issue.due).toLocaleDateString('en-CA') : '',
    ]
    {/****** Q2: Coding Ends here.******/}
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <View style={styles.table}>
        {row.map((data, index) => (
            <Text style={[styles.cell, { width: width[index] }]}>{data}</Text>
        ))}
      </View>
      {/****** Q2: Coding Ends here. ******/}
      </>
    );
  }
  
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    const header = [
        'ID',
        'Title',
        'Status',
        'Owner',
        'Created Date',
        'Effort',
        'Due Date'
    ]
    {/****** Q2: Coding Ends here. ******/}
    
    
    return (
    <>
    <Text style={styles.headerText}>Issue Table</Text>
    <View style={styles.container}>
    {/****** Q2: Start Coding here to render the table header/rows.**********/}
      <ScrollView horizontal={true} style={styles.scroller}>
        <View>
          <View style={styles.table}>
            {header.map((headerText, index) => (
              <Text style={[styles.cell, { width: width[index] }]}>{headerText}</Text>
            ))}
          </View>
          {issueRows}
        </View>
      </ScrollView>
    {/****** Q2: Coding Ends here. ******/}
    </View>
    </>
    );
  }

  
  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = {
      title: '',
      status: 'New',
      owner: null,
      effort: null,
      due: null,
      show: false,
    };
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleInputChange = (field, value) => {
        this.setState({ [field]: value });
    };
    /****** Q3: Code Ends here. ******/

    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
        const { title, status, owner, effort, due } = this.state;

        const issue = {
          title: title,
          status: status,
          owner: owner || 'New',
          effort: effort ? parseInt(effort, 10) : null,
          due: due,
        };
        this.props.createIssue(issue);

        this.setState({
          title: '',
          status: 'New',
          owner: null,
          effort: null,
          due: null,
        });

        Alert.alert("Add Success.");
      /****** Q3: Code Ends here. ******/
    }

    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <View>
        <Text style={styles.headerText}>Add a New Issue</Text>
        <View style={styles.form}>
        <Text style={styles.formText}>Title</Text>
        <TextInput
          style={styles.input}
          value={this.state.title}
          onChangeText={(text) => this.handleInputChange('title', text)}
        />
        </View>
        <View style={styles.form}>
            <Text style={styles.formText}>Status</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={this.state.status}
                    onValueChange={(itemValue) => this.handleInputChange('status', itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="New" value="New" />
                    <Picker.Item label="Assigned" value="Assigned" />
                    <Picker.Item label="Fixed" value="Fixed" />
                    <Picker.Item label="Closed" value="Closed" />
                </Picker>
            </View>
        </View>
        <View style={styles.form}>
            <Text style={styles.formText}>Owner</Text>
            <TextInput
              style={styles.input}
              value={this.state.owner}
              onChangeText={(text) => this.handleInputChange('owner', text)}
            />
        </View>
        <View style={styles.form}>
            <Text style={styles.formText}>Effort</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={this.state.effort}
              onChangeText={(text) => this.handleInputChange('effort', text)}
            />
        </View>
        <View style={styles.form}>
            <Text style={styles.formText}>Due Date</Text>
            <TouchableOpacity onPress={() => this.handleInputChange('show', true )}>
              <TextInput
                style={styles.input}
                value={this.state.due}
                editable={false}
                style={styles.input}
              />
            </TouchableOpacity>
          {this.state.show && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                this.setState({
                  due: selectedDate ? selectedDate.toLocaleDateString('en-CA') : due,
                  show: false,
                });
              }}
            />
          )}
        </View>
        <Button title="Submit" onPress={this.handleSubmit} />
      </View>
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = { name: '' };
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleChange(value) {
        this.setState({ name: value });
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
        const name = this.state.name;
        const query = `mutation addToBlacklist($name: String!) {
          addToBlacklist(nameInput: $name)
        }`;

        const data = await graphQLFetch(query, { name });
        this.setState({name: ''});
        Alert.alert("Add Success.");
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <Text style={styles.headerText}>Add to BlackList</Text>
            <View style={styles.form}>
                <Text style={styles.formText}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={this.state.name}
                  onChangeText={(text) => this.handleChange(text)}
                />
            </View>
            <Button title="Submit" onPress={this.handleSubmit} />
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [], selector: 1 };
        this.createIssue = this.createIssue.bind(this);
        this.addToBlacklist = this.addToBlacklist.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            issueList {
            id title status owner
            created effort due
            }
        }`;

        const data = await graphQLFetch(query);

        if (data) {
            this.setState({ issues: data.issueList });
        }
    }

    async createIssue(issue) {
        const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue: $issue) {
            id
            }
        }`;

        const data = await graphQLFetch(query, { issue });

        if (data) {
            this.loadData();
        }
    }

    async addToBlacklist(nameInput) {
        const query = `mutation addToBlacklist($nameInput: nameInput!) {
            addToBlacklist(nameInput: $nameInput) {
                result
            }
        }`;

        const data = await graphQLFetch(query, { nameInput });
    }
    
    setSelector(value) {
        this.setState({ selector: value });
    }
    
    render() {
        return (
        <>
    {/****** Q1: Start Coding here. ******/}
          <View style={styles.nav}>
            <Button title="IssueFilter" onPress={() => this.setSelector(1)}>IssueFilter</Button>
            <Button title="IssueTable" onPress={() => this.setSelector(2)}>IssueTable</Button>
            <Button title="IssueAdd" onPress={() => this.setSelector(3)}>IssueAdd</Button>
            <Button title="BlackList" onPress={() => this.setSelector(4)}>BlackList</Button>
          </View>
        {this.state.selector === 1 && <IssueFilter/>}
        {this.state.selector === 2 && <IssueTable issues={this.state.issues}/>}
        {this.state.selector === 3 && <IssueAdd createIssue={this.createIssue}/>}
        {this.state.selector === 4 && <BlackList addToBlacklist={this.addToBlacklist}/>}
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    {/****** Q4: Code Ends here. ******/}
        </>
      
    );
  }
}
