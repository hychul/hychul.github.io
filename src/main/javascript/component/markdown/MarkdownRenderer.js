import SyntaxHighlighter from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/esm/styles/hljs";

const markdownRenderer = {
  h1: h1,
  h2: h2,
  h3: h3,
  h4: h4,
  h5: h5,
  h6: h6,
  code: code,
  img: image,
  table: table,
  a: link,
  blockquote: blockquote,
};

function h1(props) {
  let style = {
    margin: "15px 0 10px",
    lineHeight: "1.75",
    fontWeight: "bold",
    fontSize: "2em",
    borderBottom: "solid 1px #4A4A4A",
  };

  return <div style={style}>{props.children}</div>;
}

function h2(props) {
  let style = {
    margin: "15px 0 10px",
    lineHeight: "1.75",
    fontWeight: "bold",
    fontSize: "1.5em",
    borderBottom: "solid 1px #4A4A4A",
  };

  return <div style={style}>{props.children}</div>;
}

function h3(props) {
  let style = {
    margin: "15px 0 10px",
    lineHeight: "1.75",
    fontWeight: "bold",
    fontSize: "1.125em",
  };

  return <div style={style}>{props.children}</div>;
}

function h4(props) {
  let style = {
    margin: "15px 0 10px",
    lineHeight: "1.75",
    fontWeight: "bold",
    fontSize: "1em",
  };

  return <div style={style}>{props.children}</div>;
}

function h5(props) {
  let style = {
    margin: "15px 0 10px",
    lineHeight: "1.75",
    fontWeight: "bold",
    fontSize: "0.875em",
  };

  return <div style={style}>{props.children}</div>;
}

function h6(props) {
  let style = {
    margin: "15px 0 10px",
    lineHeight: "1.75",
    fontWeight: "bold",
    fontSize: "0.875em",
    color: "#8B888F",
  };

  return <div style={style}>{props.children}</div>;
}

function code(props) {
  return props.inline ? (
    <code
      style={{
        borderRadius: "0.25em",
        padding: "4px",
        backgroundColor: "#181818",
        fontSize: "0.875em",
        color: "#FDE55F",
      }}
    >
      {props.children}
    </code>
  ) : (
    <SyntaxHighlighter
      language={props.language}
      // showLineNumbers
      wrapLines={false}
      lineProps={{ style: { wordBreak: "keep-all", whiteSpace: "pre-wrap" } }}
      style={monokai}
      customStyle={{
        width: "calc(100% - 32px)",
        marginRight: "-10000vw",
        borderRadius: "0.25em",
        padding: "16px",
        backgroundColor: "#181818",
        lineHeight: "1.5",
        fontSize: "0.85em",
      }}
      children={props.children}
    />
  );
}

function image(props) {
  return (
    <img
      style={{
        width: "auto",
        maxWidth: "min(720px, 100%)",
        marginRight: "-10000vw",
      }}
      src={props.src}
      alt={props.alt}
    />
  );
}

function table(props) {
  let head = props.children[0];
  const headRows = [];
  if (head !== undefined) {
    head.props.children[0].props.children.forEach((it) => {
      headRows.push(
        <th
          key={it.key}
          style={{
            border: "1px solid #454440",
            padding: "0.3em 0.75em",
            textAlign: it.props?.style?.textAlign,
            fontWeight: "bold",
          }}
        >
          {it.props?.children}
        </th>
      );
    });
  }

  let body = props.children[1];
  const bodyRows = [];
  if (body !== undefined) {
    let index = 0;
    body.props.children.forEach((it) => {
      const row = [];
      it.props.children.forEach((it) => {
        let key = it.key;
        let align = it.props?.style?.textAlign;
        let value = it.props?.children;
        row.push(
          <td
            key={key}
            style={{
              border: "1px solid #454440",
              padding: "0.3em 0.75em",
              textAlign: align,
              backgroundColor: index % 2 === 0 ? "clear" : "#363537",
            }}
          >
            {value}
          </td>
        );
      });

      bodyRows.push(<tr key={it.key}>{row}</tr>);

      index++;
    });
  }

  return (
    <table
      style={{
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>{headRows}</tr>
      </thead>
      <tbody>{bodyRows}</tbody>
    </table>
  );
}

function link(props) {
  return (
    <a
      style={{
        wordBreak: "break-all",
        textDecoration: "none",
        fontWeight: "700",
        color: "#4990f3",
      }}
      href={props.href}
    >
      {props.children}
    </a>
  );
}

function blockquote(props) {
  return (
    <div
      style={{
        width: "calc(100% - 32px)",
        marginRight: "-10000vw",
        padding: "2px 12px 2px 16px",
        borderLeft: "solid 4px #454440",
        backgroundColor: "clear",
        color: "#8B888F",
      }}
    >
      {props.children}
    </div>
  );
}

export default markdownRenderer;
