# short-url

<ul>
<li><p><code>GET /</code></p>

<ul>
<li>if user is logged in:

<ul>
<li>redirect -&gt; <code>/urls</code></li>
</ul></li>
<li>if user is not logged in:

<ul>
<li>redirect -&gt; <code>/login</code></li>
</ul></li>
</ul></li>
<li><p><code>GET /urls</code></p>

<ul>
<li>if user is not logged in:

<ul>
<li>returns a 401 response, HTML with a relevant error message and a link to <code>/login</code></li>
</ul></li>
<li>if user is logged in:

<ul>
<li>returns a 200 response, HTML with:</li>
<li>the site header (see below)</li>
<li>a table of urls the user has created, each row:

<ul>
<li>short url</li>
<li>long url</li>
<li>edit button -&gt; <code>GET /urls/:id</code></li>
<li>delete button -&gt; <code>POST /urls/:id/delete</code></li>
<li>date created (stretch)</li>
<li>number of visits (stretch)</li>
<li>number of unique visits (stretch)</li>
</ul></li>
<li>a link to "Create a New Short Link" -&gt; <code>/urls/new</code></li>
</ul></li>
</ul></li>
<li><p><code>GET /urls/new</code></p>

<ul>
<li>if user is not logged in:

<ul>
<li>returns a 401 response, HTML with:</li>
<li>error message</li>
<li>a link to <code>/login</code></li>
</ul></li>
<li>if user is logged in:

<ul>
<li>returns a 200 response, HTML with:</li>
<li>the site header (see below)</li>
<li>a form, which contains:

<ul>
<li>text input field for the original URL</li>
<li>submit button -&gt; <code>POST /urls</code></li>
</ul></li>
</ul></li>
</ul></li>
<li><p><code>GET /urls/:id</code></p>

<ul>
<li>if url w/ <code>:id</code> does not exist:

<ul>
<li>returns a 404 response, HTML with a relevant error message</li>
</ul></li>
<li>if user is not logged in:

<ul>
<li>returns a 401 response,  HTML with a relevant error message and a link to <code>/login</code></li>
</ul></li>
<li>if logged in user does not match the user that owns this url:

<ul>
<li>returns a 403 response,  HTML with a relevant error message</li>
</ul></li>
<li>if all is well:

<ul>
<li>returns a 200 response, HTML with:</li>
<li>the short url</li>
<li>date created (stretch)</li>
<li>number of visits (stretch)</li>
<li>number of unique visits (stretch)</li>
<li>a form, which contains:

<ul>
<li>the long url</li>
<li>"update" button -&gt; <code>POST /urls/:id</code></li>
<li>"delete" button -&gt; <code>POST /urls/:id/delete</code></li>
</ul></li>
</ul></li>
</ul></li>
<li><p><code>GET /u/:id</code></p>

<ul>
<li>if url with <code>:id</code> exists:

<ul>
<li>redirect -&gt; the corresponding longURL</li>
</ul></li>
<li>otherwise:

<ul>
<li>returns a 404 response, HTML with a relevant error message</li>
</ul></li>
</ul></li>
<li><p><code>POST /urls</code></p>

<ul>
<li>if user is logged in:

<ul>
<li>generates a shortURL, saves the link and associates it with the user</li>
<li>redirect -&gt; <code>/urls/:id</code></li>
</ul></li>
<li>if user is not logged in:

<ul>
<li>returns a 401 response, HTML with a relevant error message and a link to <code>/login</code></li>
</ul></li>
</ul></li>
<li><p><code>POST /urls/:id</code></p>

<ul>
<li>if url with <code>:id</code> does not exist:

<ul>
<li>returns a 404 response, HTML with a relevant error message</li>
</ul></li>
<li>if user is not logged in:

<ul>
<li>returns a 401 response, HTML with a relevant error message and a link to <code>/login</code></li>
</ul></li>
<li>if user does not match the url owner:

<ul>
<li>returns a 403 response, HTML with a relevant error message</li>
</ul></li>
<li>if all is well:

<ul>
<li>updates the url</li>
<li>redirect -&gt; <code>/urls/:id</code></li>
</ul></li>
</ul></li>
<li><p><code>GET /login</code></p>

<ul>
<li>if user is logged in:

<ul>
<li>redirect -&gt; <code>/</code></li>
</ul></li>
<li>if user is not logged in:

<ul>
<li>returns a 200 response, HTML with:</li>
<li>a form which contains:

<ul>
<li>input fields for email and password</li>
<li>submit button -&gt; <code>POST /login</code></li>
</ul></li>
</ul></li>
</ul></li>
<li><p><code>GET /register</code></p>

<ul>
<li>if user is logged in:

<ul>
<li>redirect -&gt; <code>/</code></li>
</ul></li>
<li>if user is not logged in:

<ul>
<li>returns a 200 response, HTML with:</li>
<li>a form, which contains:

<ul>
<li>input fields for email and password</li>
<li>"register" button -&gt; <code>POST /register</code></li>
</ul></li>
</ul></li>
</ul></li>
<li><p><code>POST /register</code></p>

<ul>
<li>if email or password are empty:

<ul>
<li>returns a 400 response, with a relevant error message</li>
</ul></li>
<li>if email already exists:

<ul>
<li>returns a 400 response, with a relevant error message</li>
</ul></li>
<li>if all is well:

<ul>
<li>creates a user</li>
<li>encrypts their password with <code>bcrypt</code></li>
<li>sets a cookie</li>
<li>redirect -&gt; <code>/</code></li>
</ul></li>
</ul></li>
<li><p><code>POST /login</code></p>

<ul>
<li>if email &amp; password params match an existing user:

<ul>
<li>sets a cookie</li>
<li>redirect -&gt; <code>/</code></li>
</ul></li>
<li>if they don't match:

<ul>
<li>returns a 401 response, HTML with a relevant error message</li>
</ul></li>
</ul></li>
<li><p><code>POST /logout</code></p>

<ul>
<li>deletes cookie</li>
<li>redirect -&gt; <code>/</code></li>
</ul></li>
<li><p>THE SITE HEADER:</p>

<ul>
<li>if a user is logged in, the header shows:

<ul>
<li>user's email</li>
<li>"My Links" link -&gt; <code>/urls</code></li>
<li>logout button -&gt; <code>POST /logout</code></li>
</ul></li>
<li>if not logged in, the header shows:

<ul>
<li>a link to the log-in page <code>/login</code></li>
<li>a link to the registration page <code>/register</code></li>
</ul></li>
</ul></li>
</ul>