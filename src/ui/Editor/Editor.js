/* eslint-disable no-octal-escape */
import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import * as PropTypes from "prop-types";
import { Container, Button } from "semantic-ui-react";
import Codemirror from "./Codemirror";
import * as schemaConvert from "./editorSchemaConverter";
import cypherFunctions from "./cypher/functions";
import consoleCommands from "./language/consoleCommands";
import { Render } from "./../Render";

export class Editor extends Component {
  constructor(props) {
    super(props);
    this.schema = {
      consoleCommands: consoleCommands,
      parameters: this.parameters || [],
      labels: this.props.labels
        ? this.props.labels.map(schemaConvert.toLabel)
        : [],
      relationshipTypes: this.props.relationshipTypes
        ? this.props.relationshipTypes.map(schemaConvert.toRelationshipType)
        : [],
      propertyKeys: this.props.properties
        ? this.props.properties.map(schemaConvert.toPropertyKey)
        : [],
      functions: this.props.functions
        ? this.props.functions.map(schemaConvert.toFunction)
        : [...cypherFunctions],
      procedures: this.props.procedures
        ? this.props.procedures.map(schemaConvert.toProcedure)
        : []
    };
    this.eventHandler = this.props.eventHandler || {
      onExecute: () => {},
      onFavoriteClick: () => {},
      onFavoriteUpdateClick: () => {}
    };
    this.state = {
      historyIndex: -1,
      buffer: "",
      mode: "cypher",
      notifications: [],
      expanded: false,
      lastPosition: { line: 0, column: 0 }
    };
  }

  focusEditor() {
    this.codeMirror.focus();
    this.codeMirror.setCursor(this.codeMirror.lineCount(), 0);
  }

  expandEditorToggle() {
    this.setState({ expanded: !this.state.expanded });
  }

  clearEditor() {
    this.setEditorValue("");
    this.setContentId(null);
  }

  handleEnter(cm) {
    if (cm.lineCount() === 1) {
      return this.execCurrent(cm);
    }
    this.newlineAndIndent(cm);
  }

  newlineAndIndent(cm) {
    cm.execCommand("newlineAndIndent");
  }

  execCurrent() {
    const value = this.getEditorValue();
    if (!value) return;
    this.eventHandler.onExecute(value);
    this.clearEditor();
    this.setState({ historyIndex: -1, buffer: null, expanded: false });
  }

  moveCursorToEndOfLine(cm) {
    cm.setCursor(cm.lineCount(), 0);
  }

  handleUp(cm) {
    if (cm.lineCount() === 1) {
      this.historyPrev(cm);
      this.moveCursorToEndOfLine(cm);
    } else {
      cm.execCommand("goLineUp");
    }
  }

  handleDown(cm) {
    if (cm.lineCount() === 1) {
      this.historyNext(cm);
      this.moveCursorToEndOfLine(cm);
    } else {
      cm.execCommand("goLineDown");
    }
  }

  historyPrev(cm) {
    if (!this.props.history.length) return;
    if (this.state.historyIndex + 1 === this.props.history.length) return;
    if (this.state.historyIndex === -1) {
      // Save what's currently in the editor
      this.setState({ buffer: cm.getValue() });
    }
    this.setState({
      historyIndex: this.state.historyIndex + 1,
      editorHeight: this.editor && findDOMNode(this.editor).clientHeight
    });
    this.setEditorValue(this.props.history[this.state.historyIndex]);
  }

  historyNext(cm) {
    if (!this.props.history.length) return;
    if (this.state.historyIndex <= -1) return;
    if (this.state.historyIndex === 0) {
      // Should read from buffer
      this.setState({ historyIndex: -1 });
      this.setEditorValue(this.state.buffer);
      return;
    }
    this.setState({
      historyIndex: this.state.historyIndex - 1,
      editorHeight: this.editor && findDOMNode(this.editor).clientHeight
    });
    this.setEditorValue(this.props.history[this.state.historyIndex]);
  }

  triggerAutocompletion(cm, changed) {
    if (changed.text.length !== 1 || !this.props.enableEditorAutocomplete) {
      return;
    }

    const text = changed.text[0];
    const triggerAutocompletion =
      text === "." ||
      text === ":" ||
      text === "[]" ||
      text === "()" ||
      text === "{}" ||
      text === "[" ||
      text === "(" ||
      text === "{";
    if (triggerAutocompletion) {
      cm.execCommand("autocomplete");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.content !== null &&
      nextProps.content !== this.getEditorValue()
    ) {
      this.setEditorValue(nextProps.content);
    }
  }

  componentDidMount() {
    this.codeMirror = this.editor.getCodeMirror();
    this.codeMirror.on("change", this.triggerAutocompletion.bind(this));

    if (this.props.content) {
      this.setEditorValue(this.props.content);
    }

    if (this.props.bus) {
      this.props.bus.take(SET_CONTENT, msg => {
        this.setContentId(null);
        this.setEditorValue(msg.message);
      });
      this.props.bus.take(EDIT_CONTENT, msg => {
        this.setContentId(msg.id);
        this.setEditorValue(msg.message);
      });
      this.props.bus.take(FOCUS, this.focusEditor.bind(this));
      this.props.bus.take(EXPAND, this.expandEditorToggle.bind(this));
    }
  }

  getEditorValue() {
    return this.codeMirror ? this.codeMirror.getValue().trim() : "";
  }

  setEditorValue(cmd) {
    this.codeMirror.setValue(cmd);
    this.updateCode(cmd, undefined, () => {
      this.focusEditor();
    });
  }

  setContentId(id) {
    this.setState({ contentId: id });
  }

  updateCode(newCode, change, cb = () => {}) {
    const mode = "cypher";
    const lastPosition = change && change.to;

    this.setState(
      {
        mode,
        lastPosition: lastPosition
          ? { line: lastPosition.line, column: lastPosition.ch }
          : this.state.lastPosition,
        editorHeight: this.editor && findDOMNode(this.editor).clientHeight
      },
      cb
    );
  }

  lineNumberFormatter(line) {
    if (!this.codeMirror || this.codeMirror.lineCount() === 1) {
      return "$";
    } else {
      return line;
    }
  }

  componentDidUpdate() {
    if (this.editor) {
      const editorHeight = findDOMNode(this.editor).clientHeight;
      if (editorHeight !== this.state.editorHeight) {
        this.setState({ editorHeight });
      }
    }
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: this.state.mode,
      theme: "cypher",
      gutters: ["cypher-hints"],
      lineWrapping: true,
      autofocus: true,
      smartIndent: false,
      lineNumberFormatter: this.lineNumberFormatter.bind(this),
      lint: true,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
        Enter: this.handleEnter.bind(this),
        "Shift-Enter": this.newlineAndIndent.bind(this),
        "Cmd-Enter": this.execCurrent.bind(this),
        "Ctrl-Enter": this.execCurrent.bind(this),
        "Cmd-Up": this.historyPrev.bind(this),
        "Ctrl-Up": this.historyPrev.bind(this),
        Up: this.handleUp.bind(this),
        "Cmd-Down": this.historyNext.bind(this),
        "Ctrl-Down": this.historyNext.bind(this),
        Down: this.handleDown.bind(this)
      },
      hintOptions: {
        completeSingle: false,
        closeOnUnfocus: false,
        alignWithWord: true,
        async: true
      },
      autoCloseBrackets: {
        explode: ""
      }
    };
    const updateCode = (val, change) => this.updateCode(val, change);
    return (
      <Container>
        <Container>
          <Codemirror
            ref={ref => {
              this.editor = ref;
            }}
            onChange={updateCode}
            options={options}
            schema={this.schema}
            initialPosition={this.state.lastPosition}
          />
        </Container>
        <Container>
          <Render if={this.state.contentId}>
            <Button
              onClick={() =>
                this.eventHAandler.onFavoriteUpdateClick(
                  this.state.contentId,
                  this.getEditorValue()
                )
              }
              content="Favorite"
            />
          </Render>
          <Render if={!this.state.contentId}>
            <Button
              onClick={() =>
                this.eventHandler.onFavoriteClick(this.getEditorValue())
              }
              content="Update favorite"
            />
          </Render>
          <Button onClick={() => this.clearEditor()} content="Clear" />
          <Button onClick={() => this.execCurrent()} content="Submit" />
        </Container>
      </Container>
    );
  }
}

Editor.propTypes = {
  expanded: PropTypes.string,
  eventHandler: PropTypes.object,
  enableEditorAutocomplete: PropTypes.bool,
  content: PropTypes.string,
  history: PropTypes.array,
  consoleCommands: PropTypes.object,
  parameters: PropTypes.array,
  labels: PropTypes.array,
  relationshipTypes: PropTypes.array,
  propertyKeys: PropTypes.array,
  functions: PropTypes.array,
  procedures: PropTypes.array
};

export default Editor;
