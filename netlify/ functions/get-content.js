const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const { type, exam, subject } = params;

    let dir = "_jobs";

    if (type === "syllabus") dir = "_syllabus";
    if (type === "ca") dir = "_ca";

    const folder = path.join(process.cwd(), dir);

    if (!fs.existsSync(folder)) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(type === "syllabus" ? {} : [])
      };
    }

    const files = fs
      .readdirSync(folder)
      .filter(file => file.endsWith(".md"));

    // -----------------------
    // SYLLABUS
    // -----------------------

    if (type === "syllabus") {

      const file = files.find(f => {

        const content = fs.readFileSync(
          path.join(folder, f),
          "utf8"
        );

        const { data } = matter(content);

        return (
          data.exam === exam &&
          data.subject === subject
        );

      });

      if (!file) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        };
      }

      const content = fs.readFileSync(
        path.join(folder, file),
        "utf8"
      );

      const { data, content: body } = matter(content);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...data,
          body
        })
      };

    }

    // -----------------------
    // JOBS & CURRENT AFFAIRS
    // -----------------------

    const items = files
      .map(file => {

        const content = fs.readFileSync(
          path.join(folder, file),
          "utf8"
        );

        const { data, content: body } = matter(content);

        return {
          ...data,
          body
        };

      })
      .sort((a, b) => {
        return new Date(b.date || b.last_date || 0) -
               new Date(a.date || a.last_date || 0);
      });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(items)
    };

  } catch (err) {

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: err.message
      })
    };

  }
};
