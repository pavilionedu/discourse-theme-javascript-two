/* learning_step
* unit:        discourse_theme_development.7
* number:      3
* title:       Do all your modifications via the plugin api
* description: We introduced the Discourse Client Plugin API in the last unit.
*              We're going to be spending more time with it this unit because
*              whenever you're modifying the Discourse javascript you should
*              always do it via the Plugin API, which also means you'll always
*              be doing it in an initializer.
*
*              In most cases you'll only ever need the one initializer in a theme.
*              The only time you'll want to create multiple is if your initializer
*              is getting too long and you want to break it up into different
*              files to make it easier to read. It doesn't matter what you call
*              your initializer(s), as long as its in the right folder
*              (initializers, or api-intializers), it'll will work.
*
*              You may also notice that we're using a slightly different way
*              of creating our initializer in this unit than we did in the
*              previous javascript unit. Both approaches will work. The one
*              we're using here is just a slightly simpler approach which has
*              been added to Discourse more recently.
*/
import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("0.8", (api) => {
  api.modifyClass('component:d-navigation', {

  });
});
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      4
* title:       What code is relevant?
* description: There's a few concepts you need to know when modifying Discourse
*              javascript. We're going to work through them by modifying what
*              happens when a user clicks the "Create Topic" button. Make all of
*              your code edits to the initializer definition above.
*
*              The first question we need to ask is what code is relevant? What
*              javascript is running when the user clicks "Create Topic"? The
*              way we start to figure that out is the same way we figured out
*              what templates were relevant when we wanted to add HTML.
*
* exercise:    Find the template that contains the Create Topic button. Post a
*              link to the code location in GitHub in the comments.
* review:      peer
* mark:        pass_change_fail
*/
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      5
* title:       How actions work in Discourse
* description: Now that we know where the HTML for the button is, how do we find
*              the javascript that's running when we click it? In Ember interactivity
*              is handled by "actions". Basically this means there's a javascript
*              callback function that's called when an element with an action is
*              clicked.
*
*              Looking at our ``create-topic-button`` template we can see there's
*              an action being "passed" to our d-button component
*
*              ```
*              action=action
*              ```
*
*              The left ``action`` is a "property" in the d-button component and it's
*              being set by the ``action`` property in the ``create-topic-button``
*              component.
*
*              Let's first have a look at how the ``action`` property is being
*              used in the ``d-button`` component. Open up the ``d-button``
*              javascript file and have a look for instances of "action". You'll
*              find they're all in a function called ``click``. If you've read the
*              Ember guides you'll know that every Ember component has a ``click``
*              function which gets run when the component HTML is clicked.
*
*              If you follow the logic of the javascript in the ``click`` function
*              you'll see that the ``action`` property can be a few different things.
*              but the primary one is as a function, i.e. it's invoked, along
*              with an argument.
*
*              ```
*              action(this.actionParam);
*              ```
*
*              Let's go back up the template hierarchy to find where the property
*              (our action function) is set. In our ``d-navigation`` template,
*              which contains the ``create-topic-button`` template, we can see
*              the ``action`` that's passed to that template is being set follows:
*
*              ```
*              action=(action "clickCreateTopicButton")
*              ```
*
*              If you've read the Ember guides on actions before you'll recognise
*              this syntax. The ``action`` property in the ``create-topic-button``
*              component is being assigned an action callback function called
*              "clickCreateTopicButton". This tells us what function we need to
*              look for in the ``d-navigation``javascript component.
*
* references:  https://guides.emberjs.com/v3.4.0/templates/actions
*/
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      6
* title:       How to override methods in classes
* description: Ok, so now we know where our action callback function is, how do
*              we modify it? Before you read the answer think about what we've
*              talked about so far. What's the only way you should be modifying
*              javascript in Discourse?
*
*              The most common plugin api method you'll be using when modifying
*              Discourse javascript is ``modifyClass``. This method lets you
*              modify most of the javascript methods in the Discourse Ember client.
*              This includes any method in a file in any of these folders:
*
*              - components
*              - controllers
*              - models
*              - routes
*
*              The way you modify methods in any of those types of classes is by
*              passing a string with the class type, a colon and the class name
*              (same as the file name) as the first argument. Here's some examples
*
*              ```
*              component:d-navigation
*              ```
*              Means we're modifying the javascript in the [``d-navigation`` component](https://github.com/discourse/discourse/blob/main/app/assets/javascripts/discourse/app/components/d-navigation.js)
*
*              ```
*              controller:discovery
*              ```
*              Means we're modifying the javascript in the [``discovery`` controller](https://github.com/discourse/discourse/blob/main/app/assets/javascripts/discourse/app/controllers/discovery.js)
*
*              To learn more about this notation system, and what's going on here
*              read about the "lookup" method for the Ember container in the
*              references.
*
*              You then pass an object as the second second argument and define
*              any methods you like on that object. If you define a method with
*              the same name as a method in the class you're modifying it will
*              override the original method. Note that when you override an
*              "action" callback, you have to define that method inside an
*              ``action`` object.
*
* exercise:    Add a definition for ``clickCreateTopicButton`` to the modifyClass
*              function so that it overrides the same function in ``d-navigation``.
*              Add a line of javascript that will show a modal to the user saying
*              "Create topic disabled" when the method is run, then post a screenshot
*              of the modal appearing when you click the Create Topic button.
* review:      peer
* mark:        pass_change_fail
* references:  https://api.emberjs.com/ember/release/classes/ContainerProxyMixin/methods?anchor=lookup
*/
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      7
* title:       How to preserve the existing functionality
* description: When we're modifying existing javascript we often want to preserve
*              some or all of the existing functionality when adding our own. In
*              our example of the Create Topic callback, we may only want something
*              to happen in _addition_ to the composer opening, not to prevent it
*              from opening entirely.
*
*              The way you preserve the functionality of an overriden method is
*              you invoke a special function called ``_super``. Think of this as
*              the same as invoking the original method you overrode. You invoke
*              it like this:
*
*              ```
*              this._super();
*              ```
*
*              Any arguments you pass to ``super`` will be the arguments that get
*              passed to the overriden method, which is why you'll often see this
*
*              ```
*              this._super(...arguments);
*              ```
*
*              This passes the same arguments received by the overriding method
*              to the overriden method.
*
* exercise:    Modify your overriden ``clickCreateTopicButton`` method so the user
*              is first asked "Are you sure you want to open the composer?". If
*              they click ok, the composer opens, if they don't it doesn't open.
*
*              Post a screen recording of the result. If you're not sure about
*              how to show a confirmation modal using javascript review the
*              documentation linked in the references.
* review:      peer
* mark:        pass_change_fail
* references:  https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
*/
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      8
* title:       Re-use existing functionality where you can
* description: In addition to preserving existing functionality, you also want to
*              always be on the lookout to re-use existing functionality where
*              possible. There are a few reasons for this, including keeping
*              your code [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
*              and keeping the UX your code creates consistent with the rest of
*              the Discourse client.
*
* exercise:    We've actually already encountered an opportunity to re-use
*              existing functionality in our example above. Just looking at the
*              core code for the ``clickCreateTopicButton`` method, see if you
*              can figure out how to display a Discourse confirmation modal,
*              instead of a browser confirmation modal to confirm the user
*              wants to open the composer.
*
*              Remember the principles we've been discussing throughout this
*              course, in particular searching through the discourse core codebase
*              to see how code is being used. Also, don't worry about trying to
*              get the ``_super`` method to work here. We'll have a look at how
*              that works in this context in the next step.
* review:      peer
* mark:        pass_change_fail
*/
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      9
* title:       Context matters
* description: If you figured out how to use a Discourse modal for the
*              confirmation modal, you would have also noticed that ``_super``
*              doesn't work in the callback method used by that approach.
*
*              ``_super`` only works inside of the context of the method the
*              ``_super`` is referring to, so if you have another callback inside of
*              you method override, ``_super`` won't work. In these (relatively
*              rare) cases you'll need to take a different approach.
*
*              In this case the solution is relatively simple as the method we're
*              overriding is short. You just need to call ``this.createTopic()``
*              inside the callback in our overridden method.
*
*              If you want to learn more about context in javascript read the
*              article on ``this`` in the references.
*
* references:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
* next_step:   FINISH
*/
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      10
* title:       Modifying widgets
* description: If you're modifying or extending Discourse functionality, at some
*              point you'll need to modify or extend a virtual DOM widget. The
*              main areas of the client that use widgets are
*
*              - Header
*              - Posts
*              - Timeline
*
*              Before continuing have a read of the description of Discourse's
*              virtual DOM widgets in the topic in the references. Don't worry if
*              you don't understand it all. The two main things you have to know
*              about widgets at this stage is that they're hierarchical and they
*              can have a "state".
*
*              In terms of the "state", some widgets can "remember" values until
*              the page changes. This is useful for interactive functionality.
*              Widgets rerender frequently, for example whenever they're clicked.
*              Any data not stored in the "state" is "forgotten" by the widget.
*              You don't have to know how this works right now, but the way to
*              tell if a widget has a "state" is if you see this in the widget definition:
*
*              ```
*              buildKey:
*              ```
*
*              In terms of using the state, all you need to do is set an attribute
*              on ``this.state``. For example
*
*              ```
*              this.state.menuIsOpen = true
*              ```
*
*              Then, whenever the widget is rerendered (you can force it to re-
*              render by invoking ``this.scheduleRerender()``), your attribute
*              value will be retained, i.e.
*
*              ```
*              this.state.menuIsOpen === true
*              ```
*
*              In terms of hierarchy, what you need to know at the moment is that
*              Widgets are "attached" to parent widgets in a hierarchical chain.
*              The post widget hierarchy looks a bit like this:
*
*              - post
*                - post-article
*                  - post-avatar
*                  - post-body
*                    - post-meta-data
*                    - post-contents
*                    - actions-summary
*                    - post-links
*                    etc
*
*              There's a few different ways this hierarchy is relevant when you're
*              working with widgets. We'll cover the main two in the next step:
*              data down and actions up.
* references:  https://meta.discourse.org/t/a-tour-of-how-the-widget-virtual-dom-code-in-discourse-works/40347
*/
/* /learning_step */

/* learning_step
* unit:        discourse_theme_development.7
* number:      11
* title:       Data down and actions up
* description: "Data down and action up" is a common structural philosophy in
*              javascript frameworks. It applies to both Ember and virtual DOM
*              widgets, but is particularly relevant for virtual DOM widgets.
*
*              Data gets passed in at the "top" of the hiearchy, e.g. the post
*              data gets passed to the ``post`` widget, and then it gets passed
*              down the hierarchy via the first argument of the ``html`` method
*              which you'll find in every widget (it renders the widget html).
*              This first argument is always called ``attrs``.
*
*              Actions get "sent up" a widget hierarchy using this method
*
*              ```
*              this.sendWidgetAction("callbackFunctionName", params)
*              ```
*
*              This goes up the widget hierarchy until it finds a function with
*              the same name as the first argument, i.e. "callbackFunctionName",
*              which is then run.
* next_step:   FINISH
*/
/* /learning_step */
