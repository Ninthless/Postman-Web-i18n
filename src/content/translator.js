/**
 * 页面翻译器
 * 负责将Postman网页版的文本替换为目标语言
 */

class PageTranslator {
  constructor(i18n) {
    this.i18n = i18n;
    this.observer = null;
    this.translationRules = [];
    this.translatedElements = new WeakSet();
    this.initTranslationRules();
  }

  /**
   * 初始化翻译规则
   * 这里定义了从英文到翻译键的映射规则
   */
  initTranslationRules() {
    this.translationRules = [
      // 侧边栏
      { selector: 'text', match: /^Collections$/i, key: 'sidebar.collections' },
      { selector: 'text', match: /^Environments$/i, key: 'sidebar.environments' },
      { selector: 'text', match: /^History$/i, key: 'sidebar.history' },
      { selector: 'text', match: /^APIs$/i, key: 'sidebar.apis' },
      
      // 按钮
      { selector: 'button', match: /^Save$/i, key: 'actions.save' },
      { selector: 'button', match: /^Cancel$/i, key: 'actions.cancel' },
      { selector: 'button', match: /^Send$/i, key: 'actions.send' },
      { selector: 'button', match: /^Delete$/i, key: 'actions.delete' },
      { selector: 'button', match: /^Import$/i, key: 'actions.import' },
      { selector: 'button', match: /^Export$/i, key: 'actions.export' },
      
      // Tab标签
      { selector: 'text', match: /^Params$/i, key: 'tabs.params' },
      { selector: 'text', match: /^Authorization$/i, key: 'tabs.authorization' },
      { selector: 'text', match: /^Headers$/i, key: 'tabs.headers' },
      { selector: 'text', match: /^Body$/i, key: 'tabs.body' },
      { selector: 'text', match: /^Tests$/i, key: 'tabs.tests' },
      { selector: 'text', match: /^Settings$/i, key: 'tabs.settings' },
      
      // Placeholder
      { selector: 'placeholder', match: /Enter request URL/i, key: 'placeholders.enter_request_url' },
      { selector: 'placeholder', match: /^Search$/i, key: 'placeholders.search' },
      { selector: 'placeholder', match: /^Key$/i, key: 'placeholders.key' },
      { selector: 'placeholder', match: /^Value$/i, key: 'placeholders.value' },
      
      // 集合相关
      { selector: 'text', match: /^New Collection$/i, key: 'collection.new_collection' },
      { selector: 'text', match: /^New Folder$/i, key: 'collection.new_folder' },
      { selector: 'text', match: /^New Request$/i, key: 'collection.new_request' },
      { selector: 'text', match: /^Create New Request$/i, key: 'collection.create_new_request' },
      
      // 环境相关
      { selector: 'text', match: /^New Environment$/i, key: 'environment.new_environment' },
      { selector: 'text', match: /^Manage Environments$/i, key: 'environment.manage_environments' },
      { selector: 'text', match: /^No Environment$/i, key: 'environment.no_environment' },
      
      // 工作空间
      { selector: 'text', match: /^Use a template to quickly set up your workspace$/i, key: 'workspace.use_template' },
      { selector: 'text', match: /^API demos$/i, key: 'workspace.api_demos' },
      { selector: 'text', match: /^API development$/i, key: 'workspace.api_development' },
      { selector: 'text', match: /^API testing$/i, key: 'workspace.api_testing' },
      { selector: 'text', match: /^About$/i, key: 'workspace.about' },
      { selector: 'text', match: /^Add a summary to outline the purpose of this workspace\.?$/i, key: 'workspace.add_summary' },
      { selector: 'text', match: /^Keep people informed about your work$/i, key: 'workspace.keep_informed' },
      { selector: 'text', match: /^Share important announcements and communicate API changes directly from your workspace\.?$/i, key: 'workspace.share_announcements' },
      { selector: 'text', match: /^Workspace settings$/i, key: 'workspace.workspace_settings' },
      { selector: 'text', match: /^Workspace type$/i, key: 'workspace.workspace_type' },
      { selector: 'text', match: /^Internal$/i, key: 'workspace.internal' },
      { selector: 'text', match: /^Build and test APIs within your team$/i, key: 'workspace.build_test_apis' },
      { selector: 'text', match: /^Workspace theme$/i, key: 'workspace.workspace_theme' },
      { selector: 'text', match: /^Make the workspace unique by having its theme reflect its content and your team's identity\./i, key: 'workspace.theme_description' },
      { selector: 'text', match: /^These changes will reflect for all your members\.?$/i, key: 'workspace.theme_description' },
      { selector: 'text', match: /^Accent color$/i, key: 'workspace.accent_color' },
      { selector: 'text', match: /^Color for buttons and highlights\.?$/i, key: 'workspace.accent_color_desc' },
      { selector: 'text', match: /^Theme color$/i, key: 'workspace.theme_color' },
      { selector: 'text', match: /^Overall interface color\.?$/i, key: 'workspace.theme_color_desc' },
      { selector: 'text', match: /^Preview$/i, key: 'workspace.preview' },
      { selector: 'text', match: /^Delete workspace$/i, key: 'workspace.delete_workspace' },
      { selector: 'text', match: /^Once deleted, a workspace is gone forever along with its data\.?$/i, key: 'workspace.delete_warning' },
      
      // 请求相关
      { selector: 'placeholder', match: /^Enter URL or paste text$/i, key: 'placeholders.enter_url_or_paste' },
      { selector: 'text', match: /^Query Params$/i, key: 'request.query_params' },
      { selector: 'text', match: /^Auth Type$/i, key: 'request.auth_type' },
      { selector: 'text', match: /^Inherit auth from parent$/i, key: 'request.inherit_auth' },
      { selector: 'text', match: /^The authorization header will be automatically generated when you send the request\./i, key: 'request.inherit_auth_desc' },
      { selector: 'text', match: /^No Auth$/i, key: 'request.no_auth' },
      { selector: 'text', match: /^This request does not use any authorization\.?$/i, key: 'request.no_auth_desc' },
      { selector: 'text', match: /^This request does not have a body$/i, key: 'request.no_body' },
      { selector: 'text', match: /^Beautify$/i, key: 'request.beautify' },
      { selector: 'text', match: /Learn more about/i, key: 'request.learn_more' },
      
      // HTTP 设置
      { selector: 'text', match: /^HTTP version$/i, key: 'http_settings.http_version' },
      { selector: 'text', match: /^Select the HTTP version to use for sending the request\.?$/i, key: 'http_settings.http_version_desc' },
      { selector: 'text', match: /^HTTP\/1\.x$/i, key: 'http_settings.http_1x' },
      { selector: 'text', match: /^Enable SSL certificate verification$/i, key: 'http_settings.ssl_verification' },
      { selector: 'text', match: /^Verify SSL certificates when sending a request\. Verification failures will result in the request being aborted\.?$/i, key: 'http_settings.ssl_verification_desc' },
      { selector: 'text', match: /^Automatically follow redirects$/i, key: 'http_settings.follow_redirects' },
      { selector: 'text', match: /^Follow HTTP 3xx responses as redirects\.?$/i, key: 'http_settings.follow_redirects_desc' },
      { selector: 'text', match: /^Follow original HTTP Method$/i, key: 'http_settings.follow_method' },
      { selector: 'text', match: /^Redirect with the original HTTP method instead of the default behavior of redirecting with GET\.?$/i, key: 'http_settings.follow_method_desc' },
      { selector: 'text', match: /^Follow Authorization header$/i, key: 'http_settings.follow_auth_header' },
      { selector: 'text', match: /^Retain authorization header when a redirect happens to a different hostname\.?$/i, key: 'http_settings.follow_auth_header_desc' },
      { selector: 'text', match: /^Remove referer header on redirect$/i, key: 'http_settings.remove_referer' },
      { selector: 'text', match: /^Remove the referer header when a redirect happens\.?$/i, key: 'http_settings.remove_referer_desc' },
      { selector: 'text', match: /^Enable strict HTTP parser$/i, key: 'http_settings.strict_parser' },
      { selector: 'text', match: /^Restrict responses with invalid HTTP headers\.?$/i, key: 'http_settings.strict_parser_desc' },
      { selector: 'text', match: /^Encode URL automatically$/i, key: 'http_settings.encode_url' },
      { selector: 'text', match: /^Encode the URL's path, query parameters, and authentication fields\.?$/i, key: 'http_settings.encode_url_desc' },
      { selector: 'text', match: /^Disable cookie jar$/i, key: 'http_settings.disable_cookie' },
      { selector: 'text', match: /^Prevent cookies used in this request from being stored in the cookie jar\./i, key: 'http_settings.disable_cookie_desc' },
      { selector: 'text', match: /^Use server cipher suite during handshake$/i, key: 'http_settings.server_cipher' },
      { selector: 'text', match: /^Use the server's cipher suite order instead of the client's during handshake\.?$/i, key: 'http_settings.server_cipher_desc' },
      { selector: 'text', match: /^Maximum number of redirects$/i, key: 'http_settings.max_redirects' },
      { selector: 'text', match: /^Set a cap on the maximum number of redirects to follow\.?$/i, key: 'http_settings.max_redirects_desc' },
      { selector: 'text', match: /^TLS\/SSL protocols disabled during handshake$/i, key: 'http_settings.tls_protocols' },
      { selector: 'text', match: /^Specify the SSL and TLS protocol versions to be disabled during handshake\./i, key: 'http_settings.tls_protocols_desc' },
      { selector: 'text', match: /^Cipher suite selection$/i, key: 'http_settings.cipher_selection' },
      { selector: 'text', match: /^Order of cipher suites that the SSL server profile uses to establish a secure connection\.?$/i, key: 'http_settings.cipher_selection_desc' },
      { selector: 'placeholder', match: /^Enter cipher suites$/i, key: 'placeholders.enter_cipher_suites' },
      
      // 状态文本
      { selector: 'text', match: /^Default:?$/i, key: 'status.default' },
      { selector: 'text', match: /^ON$/i, key: 'status.on' },
      { selector: 'text', match: /^OFF$/i, key: 'status.off' },
      { selector: 'text', match: /^NEW$/i, key: 'status.new' },
      
      // 导航栏
      { selector: 'text', match: /^Home$/i, key: 'navigation.home' },
      { selector: 'text', match: /^Workspaces$/i, key: 'sidebar.workspaces' },
      { selector: 'text', match: /^API Network$/i, key: 'navigation.api_network' },
      { selector: 'text', match: /^Search Postman$/i, key: 'navigation.search_postman' },
      { selector: 'text', match: /^Settings$/i, key: 'navigation.settings' },
      { selector: 'text', match: /^Notifications$/i, key: 'navigation.notifications' },
      { selector: 'text', match: /^Manage accounts$/i, key: 'navigation.manage_accounts' },
      
      // 按钮和操作
      { selector: 'text', match: /^Invite$/i, key: 'actions.invite' },
      { selector: 'text', match: /^Upgrade$/i, key: 'actions.upgrade' },
      { selector: 'text', match: /^Import$/i, key: 'actions.import' },
      { selector: 'text', match: /^Change$/i, key: 'actions.change' },
      { selector: 'text', match: /^Apply Theme$/i, key: 'workspace_ui.apply_theme' },
      { selector: 'text', match: /^Reset to Default$/i, key: 'workspace_ui.reset_to_default' },
      { selector: 'text', match: /^Bulk Edit$/i, key: 'actions.bulk_edit' },
      
      // 侧边栏项
      { selector: 'text', match: /^Flows$/i, key: 'sidebar_items.flows' },
      { selector: 'text', match: /^API$/i, key: 'sidebar_items.api' },
      { selector: 'text', match: /^Mock servers$/i, key: 'sidebar_items.mock_servers' },
      { selector: 'text', match: /^Monitors$/i, key: 'sidebar_items.monitors' },
      { selector: 'text', match: /^Specs$/i, key: 'sidebar_items.specs' },
      { selector: 'text', match: /^Insights$/i, key: 'sidebar_items.insights' },
      
      // 工作空间UI
      { selector: 'text', match: /^Contributors$/i, key: 'workspace_ui.contributors' },
      { selector: 'text', match: /^You$/i, key: 'general.you' },
      { selector: 'text', match: /^Add Workspace Description$/i, key: 'workspace_ui.add_workspace_description' },
      { selector: 'text', match: /^More templates$/i, key: 'workspace_ui.more_templates' },
      { selector: 'text', match: /^Pin Collections$/i, key: 'collection.pin_collections' },
      { selector: 'text', match: /^Connect$/i, key: 'workspace_ui.connect' },
      { selector: 'text', match: /^Unwatch$/i, key: 'workspace_ui.unwatch' },
      { selector: 'text', match: /^People in this workspace$/i, key: 'workspace_ui.people_in_workspace' },
      { selector: 'text', match: /^Manage People$/i, key: 'workspace_ui.manage_people' },
      { selector: 'text', match: /^Configure sidebar$/i, key: 'workspace_ui.configure_sidebar' },
      { selector: 'text', match: /^Show or hide the elements that are visible to everyone in this workspace\.?$/i, key: 'workspace_ui.show_hide_elements' },
      { selector: 'text', match: /^Activity log$/i, key: 'workspace_ui.activity_log' },
      { selector: 'text', match: /^Workspace info$/i, key: 'workspace_ui.workspace_info' },
      
      // 环境相关
      { selector: 'text', match: /^No Environments$/i, key: 'request_editor.no_environments' },
      { selector: 'text', match: /^Create Environment$/i, key: 'request_editor.create_environment' },
      
      // 请求编辑器
      { selector: 'text', match: /^Scripts$/i, key: 'general.scripts' },
      { selector: 'text', match: /^Cookies$/i, key: 'general.cookies' },
      { selector: 'text', match: /^Presets$/i, key: 'general.presets' },
      { selector: 'text', match: /^Response$/i, key: 'general.response' },
      { selector: 'text', match: /^Console$/i, key: 'general.console' },
      { selector: 'text', match: /^Overview$/i, key: 'general.overview' },
      { selector: 'text', match: /^Updates$/i, key: 'general.updates' },
      { selector: 'text', match: /^Click Send to get a response$/i, key: 'request_editor.click_send_response' },
      { selector: 'text', match: /^Edit Auth in collection$/i, key: 'request_editor.edit_auth_in_collection' },
      { selector: 'text', match: /^Learn more about authorization$/i, key: 'request_editor.learn_more_authorization' },
      
      // 搜索框
      { selector: 'placeholder', match: /^Search collections$/i, key: 'collection.search_collections' },
      
      // 工具
      { selector: 'text', match: /^Runner$/i, key: 'tools.runner' },
      { selector: 'text', match: /^Capture requests$/i, key: 'tools.capture_requests' },
      { selector: 'text', match: /^Cloud Agent$/i, key: 'tools.cloud_agent' },
      { selector: 'text', match: /^Vault$/i, key: 'tools.vault' },
      { selector: 'text', match: /^Trash$/i, key: 'tools.trash' },
      { selector: 'text', match: /^Help menu$/i, key: 'tools.help_menu' },
      { selector: 'text', match: /^Online$/i, key: 'status.online' },
      
      // 数据请求名称
      { selector: 'text', match: /^Get data$/i, key: 'collection.get_data' },
      { selector: 'text', match: /^Post data$/i, key: 'collection.post_data' },
      
      // 按钮
      { selector: 'text', match: /^Share$/i, key: 'buttons.share' },
      { selector: 'text', match: /^Save$/i, key: 'buttons.save' },
      { selector: 'text', match: /^Send$/i, key: 'buttons.send' },
      { selector: 'text', match: /^Delete$/i, key: 'buttons.delete' },
      { selector: 'text', match: /^Post an Update$/i, key: 'buttons.post_an_update' },
      
      // 占位符和标签
      { selector: 'text', match: /^Key$/i, key: 'placeholders.key' },
      { selector: 'text', match: /^Value$/i, key: 'placeholders.value' },
      { selector: 'text', match: /^Description$/i, key: 'placeholders.description' },
      { selector: 'placeholder', match: /^No color chosen$/i, key: 'placeholders.no_color_chosen' },
      { selector: 'text', match: /^METHOD$/i, key: 'request.method' },
      
      // 请求体类型
      { selector: 'text', match: /^none$/i, key: 'body_types.none' },
      { selector: 'text', match: /^form-data$/i, key: 'body_types.form_data' },
      { selector: 'text', match: /^x-www-form-urlencoded$/i, key: 'body_types.urlencoded' },
      { selector: 'text', match: /^raw$/i, key: 'body_types.raw' },
      { selector: 'text', match: /^binary$/i, key: 'body_types.binary' },
      { selector: 'text', match: /^GraphQL$/i, key: 'body_types.graphql' },
      
      // 标签页文本会由通用text规则处理，所以不需要特殊的tab选择器
      
      // 上下文栏
      { selector: 'aria-label', match: /^Documentation$/i, key: 'context_bar.documentation' },
      { selector: 'aria-label', match: /^Comments$/i, key: 'context_bar.comments' },
      { selector: 'aria-label', match: /^Code$/i, key: 'context_bar.code' },
      { selector: 'text', match: /^Related Requests$/i, key: 'context_bar.related_requests' },
      { selector: 'text', match: /^Request Info$/i, key: 'context_bar.request_info' },
      
      // 杂项
      { selector: 'text', match: /^(\d+)\s+hidden$/i, key: 'misc.hidden' },
      { selector: 'aria-label', match: /^Open search$/i, key: 'misc.open_search' },
      { selector: 'aria-label', match: /^Drop files anywhere to import$/i, key: 'misc.drop_files_anywhere' },
      { selector: 'aria-label', match: /^These headers will be automatically added/i, key: 'misc.these_headers_auto_added' },
      { selector: 'aria-label', match: /^Button group$/i, key: 'misc.button_group' },
      { selector: 'aria-label', match: /^dropdown toggle button$/i, key: 'misc.dropdown_toggle' },
      
      // 更多通用文本
      { selector: 'text', match: /^Enter the URL and click Send to get a response$/i, key: 'request_editor.click_send_response' },
      { selector: 'text', match: /^My Collection$/i, key: 'collection.my_collection' },
      { selector: 'label', match: /^Auth Type$/i, key: 'request.auth_type' },
      { selector: 'text', match: /^Connecting\.\.\.$/i, key: 'status.connecting' },
      { selector: 'text', match: /^Postbot$/i, key: 'general.postbot' },
      
      // aria-label翻译
      { selector: 'aria-label', match: /^close tab$/i, key: 'general.close_tab' },
      { selector: 'aria-label', match: /^Plugin shortcut$/i, key: 'general.plugin_shortcut' },
      { selector: 'aria-label', match: /^Breadcrumb navigation$/i, key: 'general.breadcrumb_navigation' },
      { selector: 'aria-label', match: /^Sidebar navigation$/i, key: 'general.sidebar_navigation' },
      { selector: 'aria-label', match: /^You can take this action when you're back online\.$/i, key: 'general.you_can_take_action_online' },
      { selector: 'aria-label', match: /^Add Workspace Description$/i, key: 'workspace_ui.add_workspace_description' },
      { selector: 'aria-label', match: /^Pin Collections$/i, key: 'collection.pin_collections' },
      { selector: 'aria-label', match: /^More templates$/i, key: 'workspace_ui.more_templates' },
      { selector: 'aria-label', match: /^Connect$/i, key: 'workspace_ui.connect' },
      { selector: 'aria-label', match: /^Unwatch$/i, key: 'workspace_ui.unwatch' },
      { selector: 'text', match: /^Run$/i, key: 'actions.run' },
      { selector: 'text', match: /^Fork$/i, key: 'actions.fork' },
      { selector: 'text', match: /^Watch$/i, key: 'actions.watch' },
      { selector: 'text', match: /^Variables$/i, key: 'tabs.variables' },
      { selector: 'text', match: /^Runs$/i, key: 'tabs.runs' },
      { selector: 'text', match: /^Welcome to Postman! This is your first collection\.$/i, key: 'general.welcome_to_postman' },
      { selector: 'text', match: /^Collections are your starting point for building and testing APIs\. You can use this one to:$/i, key: 'general.collections_starting_point' },
      { selector: 'text', match: /^• Group related requests$/i, key: 'general.group_requests' },
      { selector: 'text', match: /^• Test your API in real-world scenarios$/i, key: 'general.test_api_scenarios' },
      { selector: 'text', match: /^• Document and share your requests$/i, key: 'general.document_share_requests' },
      { selector: 'text', match: /^Update the name and overview whenever you're ready to make it yours\.$/i, key: 'general.update_name_overview' },
      { selector: 'text', match: /^(\d+)\s+requests$/i, key: 'general.requests_count', dynamic: true },
      { selector: 'text', match: /^(\d+)\s+view$/i, key: 'general.view_count', dynamic: true },
      { selector: 'text', match: /^(\d+)\s+forks$/i, key: 'general.forks_count', dynamic: true },
      { selector: 'text', match: /^(\d+)\s+watchers$/i, key: 'general.watchers_count', dynamic: true },
      { selector: 'text', match: /^Created by: $/i, key: 'general.created_by' },
      { selector: 'text', match: /^Pin an environment to automatically switch to it when working with this collection$/i, key: 'collection.pin_environment_desc' },
      { selector: 'text', match: /^Pinned Environments$/i, key: 'collection.pinned_environments' },
      { selector: 'text', match: /^Recent changes$/i, key: 'collection.recent_changes' },
      { selector: 'text', match: /^View complete documentation$/i, key: 'collection.view_complete_documentation' },
      { selector: 'text', match: /^Normal text$/i, key: 'general.normal_text' },
      { selector: 'text', match: /^Mocks$/i, key: 'sidebar_items.mocks' },
      { selector: 'text', match: /^We are opening the link in the desktop app…$/i, key: 'general.opening_desktop_app' },
      { selector: 'text', match: /^Prefer using Postman in your browser\?$/i, key: 'general.prefer_browser' },
      { selector: 'text', match: /^Always open in browser$/i, key: 'general.always_open_in_browser' },
      { selector: 'button', match: /^Open in Browser$/i, key: 'general.open_in_browser' },
      { selector: 'text', match: /^Learning Center$/i, key: 'navigation.learning_center' },
      { selector: 'text', match: /^Support Center$/i, key: 'navigation.support_center' },
      { selector: 'text', match: /^Trust and Security$/i, key: 'navigation.trust_and_security' },
      { selector: 'text', match: /^Privacy Policy$/i, key: 'navigation.privacy_policy' },
      { selector: 'text', match: /^Terms$/i, key: 'navigation.terms' },
      { selector: 'text', match: /^Get Postman for your desktop\.$/i, key: 'navigation.get_postman_desktop' },
      { selector: 'text', match: /^Download Desktop App$/i, key: 'navigation.download_desktop_app' },
      { selector: 'text', match: /^Created by:\s*$/i, key: 'navigation.created_by' },
      { selector: 'text', match: /^Your flows will appear here$/i, key: 'flows.your_flows_will_appear_here' },
      { selector: 'text', match: /^Create action$/i, key: 'flows.create_action' },
      { selector: 'text', match: /^Create flow module$/i, key: 'flows.create_flow_module' },
      { selector: 'text', match: /^Resources$/i, key: 'flows.resources' },
      { selector: 'text', match: /^View Flows docs$/i, key: 'flows.view_flows_docs' },
      { selector: 'placeholder', match: /^Search flows$/i, key: 'flows.search_flows' },
      { selector: 'text', match: /^Flows Home$/i, key: 'flows.flows_home' },
      { selector: 'text', match: /^Analytics$/i, key: 'flows.analytics' },
      { selector: 'text', match: /^Welcome to Flows$/i, key: 'flows.welcome_to_flows' },
      { selector: 'button', match: /^Create New$/i, key: 'flows.create_new' },
      { selector: 'text', match: /^Introducing Actions$/i, key: 'flows.introducing_actions' },
      { selector: 'text', match: /^EARLY ACCESS$/i, key: 'flows.early_access' },
      { selector: 'text', match: /^Build powerful, ready-to-use automations/i, key: 'flows.actions_intro_text' },
      { selector: 'button', match: /^Begin tour$/i, key: 'flows.begin_tour' },
      { selector: 'text', match: /^Learn the basics$/i, key: 'flows.learn_the_basics' },
      { selector: 'text', match: /^Walk through the highlights of Flows$/i, key: 'flows.walk_through_highlights' },
      { selector: 'text', match: /^Browse templates$/i, key: 'flows.browse_templates' },
      { selector: 'text', match: /^Get started quickly with the catalog$/i, key: 'flows.get_started_with_catalog' },
      { selector: 'text', match: /^Get support$/i, key: 'flows.get_support' },
      { selector: 'text', match: /^Learn more in the Flows docs$/i, key: 'flows.learn_more_in_docs' },
      { selector: 'text', match: /^All flows$/i, key: 'flows.all_flows' },
      { selector: 'text', match: /^Last edited$/i, key: 'flows.last_edited' },
      { selector: 'text', match: /^Flows you create will appear here$/i, key: 'flows.flows_you_create_will_appear' },
      { selector: 'text', match: /^This workspace is ready for your first flow/i, key: 'flows.workspace_ready_for_first_flow' },
      { selector: 'button', match: /^Create Flow$/i, key: 'flows.create_flow' },
      { selector: 'button', match: /^Share feedback$/i, key: 'flows.share_feedback' },
      { selector: 'text', match: /^There are no deployed Actions in this workspace\.$/i, key: 'flows.no_deployed_actions' },
      { selector: 'text', match: /^Action$/i, key: 'flows.action' },
      { selector: 'text', match: /^Flow module$/i, key: 'flows.flow_module' },
      { selector: 'text', match: /^All variables$/i, key: 'variables.all_variables' },
      { selector: 'text', match: /^Environment$/i, key: 'variables.environment' },
      { selector: 'text', match: /^No environment selected\.$/i, key: 'variables.no_environment_selected' },
      { selector: 'text', match: /^Select environment$/i, key: 'variables.select_environment' },
      { selector: 'text', match: /^Globals$/i, key: 'variables.globals' },
      { selector: 'text', match: /^No global variables in this workspace\.$/i, key: 'variables.no_global_variables' },
      { selector: 'text', match: /^Add$/i, key: 'variables.add' },
      { selector: 'text', match: /^Local Vault$/i, key: 'variables.local_vault' },
      { selector: 'text', match: /^Store your API secrets locally in vault\.$/i, key: 'variables.store_api_secrets' },
      { selector: 'text', match: /^Set up vault$/i, key: 'variables.set_up_vault' },
      { selector: 'text', match: /^Learn more$/i, key: 'flows.learn_more' },
      { selector: 'text', match: /^Comments$/i, key: 'sidebar.comments' },
      { selector: 'text', match: /^Changelog$/i, key: 'sidebar.changelog' },
      { selector: 'text', match: /^Forks$/i, key: 'sidebar.forks' },
      { selector: 'text', match: /^Collection details$/i, key: 'sidebar.collection_details' },
      { selector: 'placeholder', match: /^Ask questions or provide feedback/i, key: 'sidebar.ask_questions_feedback' },
      { selector: 'button', match: /^Comment$/i, key: 'sidebar.comment' },
      { selector: 'text', match: /^There are no pull requests$/i, key: 'sidebar.there_are_no_pull_requests' },
      { selector: 'text', match: /^There are no forks$/i, key: 'sidebar.there_are_no_forks' },
      { selector: 'text', match: /^Created by$/i, key: 'sidebar.created_by' },
      { selector: 'text', match: /^Created on$/i, key: 'sidebar.created_on' },
      { selector: 'text', match: /^Last updated$/i, key: 'sidebar.last_updated' },
      { selector: 'text', match: /^There are no mock servers created for this collection\.$/i, key: 'sidebar.no_mock_servers' },
      { selector: 'text', match: /^There are no monitors created for this collection$/i, key: 'sidebar.no_monitors' },
      { selector: 'text', match: /^Integrations$/i, key: 'sidebar.integrations' },
      { selector: 'text', match: /^Back up your collection$/i, key: 'sidebar.back_up_collection' },
      { selector: 'text', match: /^To GitHub, Dropbox or 7 other services$/i, key: 'sidebar.to_github_dropbox' },
      { selector: 'text', match: /^View all options$/i, key: 'sidebar.view_all_options' },
      { selector: 'button', match: /^Manage Team$/i, key: 'team.manage_team' },
      { selector: 'text', match: /^Cloud Agent Usage$/i, key: 'team.cloud_agent_usage' },
      { selector: 'text', match: /^Specifications$/i, key: 'team.specifications' },
      { selector: 'text', match: /^Manual Collection Runner Runs$/i, key: 'team.manual_collection_runner_runs' },
      { selector: 'text', match: /^Billing$/i, key: 'team.billing' },
      { selector: 'text', match: /^Resource Usage$/i, key: 'team.resource_usage' },
      { selector: 'text', match: /^Manage Public Elements$/i, key: 'team.manage_public_elements' },
      { selector: 'text', match: /^Manage Postman Keys$/i, key: 'team.manage_postman_keys' },
      { selector: 'text', match: /^Audit Logs$/i, key: 'team.audit_logs' },
      { selector: 'text', match: /^Team Settings$/i, key: 'team.team_settings' },
      { selector: 'text', match: /^Add request$/i, key: 'context_menu.add_request' },
      { selector: 'text', match: /^Add folder$/i, key: 'context_menu.add_folder' },
      { selector: 'text', match: /^Add example$/i, key: 'context_menu.add_example' },
      { selector: 'text', match: /^Run$/i, key: 'context_menu.run' },
      { selector: 'text', match: /^Copy link$/i, key: 'context_menu.copy_link' },
      { selector: 'text', match: /^Ask AI$/i, key: 'context_menu.ask_ai' },
      { selector: 'text', match: /^Move$/i, key: 'context_menu.move' },
      { selector: 'text', match: /^Rename$/i, key: 'context_menu.rename' },
      { selector: 'text', match: /^Duplicate$/i, key: 'context_menu.duplicate' },
      { selector: 'text', match: /^More$/i, key: 'context_menu.more' },
      { selector: 'text', match: /^View all changes$/i, key: 'general.view_all_changes' },
      
      // 授权类型
      { selector: 'text', match: /^Inherit auth from parent$/i, key: 'auth_types.inherit_auth' },
      { selector: 'text', match: /^No Auth$/i, key: 'auth_types.no_auth' },
      { selector: 'text', match: /^Basic Auth$/i, key: 'auth_types.basic_auth' },
      { selector: 'text', match: /^Bearer Token$/i, key: 'auth_types.bearer_token' },
      { selector: 'text', match: /^JWT Bearer$/i, key: 'auth_types.jwt_bearer' },
      { selector: 'text', match: /^Digest Auth$/i, key: 'auth_types.digest_auth' },
      { selector: 'text', match: /^OAuth 1\.0$/i, key: 'auth_types.oauth_1' },
      { selector: 'text', match: /^OAuth 2\.0$/i, key: 'auth_types.oauth_2' },
      { selector: 'text', match: /^Hawk Authentication$/i, key: 'auth_types.hawk_authentication' },
      { selector: 'text', match: /^AWS Signature$/i, key: 'auth_types.aws_signature' },
      { selector: 'text', match: /^NTLM Authentication$/i, key: 'auth_types.ntlm_authentication' },
      { selector: 'text', match: /^API Key$/i, key: 'auth_types.api_key' },
      { selector: 'text', match: /^Akamai EdgeGrid$/i, key: 'auth_types.akamai_edgegrid' },
      { selector: 'text', match: /^ASAP \(Atlassian\)$/i, key: 'auth_types.asap_atlassian' },
      
      // 响应面板
      { selector: 'text', match: /^Current$/i, key: 'general.current' },
      { selector: 'text', match: /^Today,/i, key: 'general.today' },
      { selector: 'text', match: /^Response not stored$/i, key: 'general.response_not_stored' },
      { selector: 'text', match: /^Save response setting must have been off when this request was sent\.$/i, key: 'general.save_response_setting_off' },
      { selector: 'text', match: /^Save response setting$/i, key: 'general.save_response_setting' },
      
      // 动态文本（包含数字的）
      { selector: 'text', match: /^(\d+)\s+hidden$/i, key: 'misc.hidden', dynamic: true }
    ];
  }

  /**
   * 获取翻译文本，支持动态参数
   */
  getTranslation(key, matches) {
    let text = this.i18n.t(key);
    if (text === key) return null;
    
    // 如果有匹配的动态参数，替换它们
    if (matches && matches.length > 1) {
      for (let i = 1; i < matches.length; i++) {
        text = text.replace(`{${i-1}}`, matches[i]);
      }
    }
    
    return text;
  }

  /**
   * 开始翻译
   */
  start() {
    // 首次翻译
    this.translatePage();

    // 监听DOM变化
    this.startObserving();

    // 监听语言变更
    window.addEventListener('i18n:locale-changed', () => {
      this.translatedElements = new WeakSet();
      this.translatePage();
    });

    console.log('[Postman i18n] 翻译器已启动');
  }

  /**
   * 翻译整个页面
   */
  translatePage() {
    // 翻译文本节点
    this.translateTextNodes(document.body);

    // 翻译属性
    this.translateAttributes(document.body);
  }

  /**
   * 翻译文本节点
   */
  translateTextNodes(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // 跳过script和style标签
          const parent = node.parentElement;
          if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
            return NodeFilter.FILTER_REJECT;
          }

          // 跳过已翻译的元素
          if (this.translatedElements.has(parent)) {
            return NodeFilter.FILTER_REJECT;
          }

          // 只处理有实际内容的文本节点
          if (node.textContent.trim()) {
            return NodeFilter.FILTER_ACCEPT;
          }

          return NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodesToTranslate = [];
    let node;
    while (node = walker.nextNode()) {
      nodesToTranslate.push(node);
    }

    // 批量翻译
    nodesToTranslate.forEach(node => {
      this.translateTextNode(node);
    });
  }

  /**
   * 翻译单个文本节点
   */
  translateTextNode(node) {
    const originalText = node.textContent.trim();
    
    if (!originalText) return;

    // 尝试匹配翻译规则
    for (const rule of this.translationRules) {
      if (rule.selector === 'text') {
        const matches = originalText.match(rule.match);
        if (matches) {
          const translatedText = rule.dynamic 
            ? this.getTranslation(rule.key, matches)
            : this.i18n.t(rule.key);
          
          if (translatedText && translatedText !== rule.key) {
            node.textContent = node.textContent.replace(originalText, translatedText);
            this.translatedElements.add(node.parentElement);
            break;
          }
        }
      }
    }
  }

  /**
   * 翻译属性
   */
  translateAttributes(root) {
    // 翻译placeholder
    const elementsWithPlaceholder = root.querySelectorAll('[placeholder]');
    elementsWithPlaceholder.forEach(element => {
      if (this.translatedElements.has(element)) return;

      const placeholder = element.getAttribute('placeholder');
      
      for (const rule of this.translationRules) {
        if (rule.selector === 'placeholder' && rule.match.test(placeholder)) {
          const translatedText = this.i18n.t(rule.key);
          
          if (translatedText && translatedText !== rule.key) {
            element.setAttribute('placeholder', translatedText);
            element.setAttribute('data-i18n-placeholder', rule.key);
            this.translatedElements.add(element);
            break;
          }
        }
      }
    });

    // 翻译title
    const elementsWithTitle = root.querySelectorAll('[title]');
    elementsWithTitle.forEach(element => {
      if (this.translatedElements.has(element)) return;

      const title = element.getAttribute('title');
      
      for (const rule of this.translationRules) {
        if (rule.selector === 'title' && rule.match.test(title)) {
          const translatedText = this.i18n.t(rule.key);
          
          if (translatedText && translatedText !== rule.key) {
            element.setAttribute('title', translatedText);
            element.setAttribute('data-i18n-title', rule.key);
            this.translatedElements.add(element);
            break;
          }
        }
      }
    });

    // 翻译aria-label
    const elementsWithAriaLabel = root.querySelectorAll('[aria-label]');
    elementsWithAriaLabel.forEach(element => {
      if (this.translatedElements.has(element)) return;

      const ariaLabel = element.getAttribute('aria-label');
      
      for (const rule of this.translationRules) {
        if (rule.selector === 'aria-label' && rule.match.test(ariaLabel)) {
          const translatedText = this.i18n.t(rule.key);
          
          if (translatedText && translatedText !== rule.key) {
            element.setAttribute('aria-label', translatedText);
            element.setAttribute('data-i18n-aria-label', rule.key);
            this.translatedElements.add(element);
            break;
          }
        }
      }
    });

    // 翻译label元素
    const labelElements = root.querySelectorAll('label');
    labelElements.forEach(element => {
      if (this.translatedElements.has(element)) return;

      const labelText = element.textContent.trim();
      
      for (const rule of this.translationRules) {
        if (rule.selector === 'label' && rule.match.test(labelText)) {
          const translatedText = this.i18n.t(rule.key);
          
          if (translatedText && translatedText !== rule.key) {
            element.textContent = translatedText;
            element.setAttribute('data-i18n-label', rule.key);
            this.translatedElements.add(element);
            break;
          }
        }
      }
    });
  }

  /**
   * 开始监听DOM变化
   */
  startObserving() {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // 处理新增的节点
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.translateTextNodes(node);
              this.translateAttributes(node);
            } else if (node.nodeType === Node.TEXT_NODE) {
              this.translateTextNode(node);
            }
          });
        }

        // 处理属性变化
        if (mutation.type === 'attributes') {
          const element = mutation.target;
          
          if (mutation.attributeName === 'placeholder' && 
              !element.hasAttribute('data-i18n-placeholder')) {
            this.translateAttributes(element);
          }
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label']
    });
  }

  /**
   * 停止监听
   */
  stopObserving() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /**
   * 添加自定义翻译规则
   */
  addRule(rule) {
    this.translationRules.push(rule);
  }

  /**
   * 添加多个自定义翻译规则
   */
  addRules(rules) {
    this.translationRules.push(...rules);
  }
}

// 导出到全局
window.PageTranslator = PageTranslator;

